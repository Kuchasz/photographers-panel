using System.Collections.Concurrent;
using System.Globalization;
using System.Text;
using System.Text.Json;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Controls.Primitives;
using Avalonia.Controls.Templates;
using Avalonia.Layout;
using Avalonia.Media;
using Avalonia.Platform.Storage;
using Avalonia.Themes.Fluent;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;
using SixLabors.ImageSharp.Processing;
using Color = Avalonia.Media.Color;
using AvaloniaBitmap = Avalonia.Media.Imaging.Bitmap;
using ImageSharpImage = SixLabors.ImageSharp.Image;

namespace GalleryGenerator;

internal static class Program
{
    [STAThread]
    public static void Main(string[] args) => BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);

    public static AppBuilder BuildAvaloniaApp() =>
        AppBuilder.Configure<App>().UsePlatformDetect();
}

internal sealed class App : Application
{
    public override void Initialize()
    {
        RequestedThemeVariant = Avalonia.Styling.ThemeVariant.Default;
        Styles.Add(new FluentTheme());
    }

    public override void OnFrameworkInitializationCompleted()
    {
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            desktop.MainWindow = new MainWindow(UiText.ForCurrentCulture());

        base.OnFrameworkInitializationCompleted();
    }
}

internal sealed class MainWindow : Window
{
    private static readonly IBrush AccentBrush = new SolidColorBrush(Color.Parse("#2563EB"));
    private static readonly IBrush HeaderBrush = new SolidColorBrush(Color.Parse("#172554"));
    private static readonly IBrush MutedBrush = new SolidColorBrush(Color.Parse("#64748B"));
    private static readonly IBrush HairlineBrush = new SolidColorBrush(Color.Parse("#CBD5E1"));

    private readonly UiText _text;
    private readonly Button _sourceButton;
    private readonly Button _selectAllButton;
    private readonly Button _deselectAllButton;
    private readonly Button _destinationButton;
    private readonly Button _previousButton;
    private readonly Button _nextButton;
    private readonly Button _createButton;
    private readonly StepProgress _steps;
    private readonly TextBlock _sourcePath;
    private readonly TextBlock _selectionSummary;
    private readonly TextBlock _destinationPath;
    private readonly TextBlock _creationSummary;
    private readonly TextBlock _emptyState;
    private readonly TextBlock _status;
    private readonly ProgressBar _progress;
    private readonly ItemsRepeater _photoGrid;
    private readonly Control[] _stepViews;
    private readonly List<PhotoSelection> _photos = [];
    private int _previewGeneration;
    private bool _isBusy;
    private int _workflowStep;
    private int _generationCurrent;
    private int _generationTotal;
    private string _destinationStatus = "";
    private string? _destinationParent;
    private StepState _generationState = StepState.Pending;

    public MainWindow(UiText text)
    {
        _text = text;
        Title = text.WindowTitle;
        Width = 920;
        Height = 720;
        MinWidth = 700;
        MinHeight = 520;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;

        TextBlock title = new()
        {
            Text = text.Title,
            FontSize = 28,
            FontWeight = FontWeight.Bold,
            Foreground = Brushes.White
        };
        TextBlock subtitle = new()
        {
            Text = text.Subtitle,
            FontSize = 14,
            Foreground = new SolidColorBrush(Color.Parse("#DBEAFE")),
            TextWrapping = TextWrapping.Wrap
        };
        Border header = new()
        {
            Background = HeaderBrush,
            Padding = new Thickness(28, 23),
            Child = new StackPanel
            {
                Spacing = 7,
                Children = { title, subtitle }
            }
        };

        _steps = new StepProgress(
            [text.StepSource, text.StepReview, text.StepDestination, text.StepCreate],
            [text.StepSourceWaiting, text.StepReviewWaiting, text.StepDestinationWaiting, text.StepCreateWaiting]);

        _sourcePath = new TextBlock
        {
            Text = text.NoSourceSelected,
            Foreground = MutedBrush,
            TextTrimming = TextTrimming.CharacterEllipsis,
            VerticalAlignment = VerticalAlignment.Center
        };
        _sourceButton = CreatePrimaryButton(text.ChooseSource);
        _sourceButton.Click += async (_, _) => await ChooseSourceAsync();

        Grid sourceRow = new()
        {
            ColumnDefinitions = ColumnDefinitions.Parse("*,Auto"),
            ColumnSpacing = 16,
            Children = { _sourcePath, _sourceButton }
        };
        Grid.SetColumn(_sourceButton, 1);
        Control sourceView = CreateStepPage(
            text.SourcePageTitle,
            text.SourcePageDescription,
            sourceRow);

        _selectionSummary = new TextBlock
        {
            Text = text.SelectionCount(0, 0),
            FontWeight = FontWeight.SemiBold,
            VerticalAlignment = VerticalAlignment.Center
        };
        _selectAllButton = CreateSecondaryButton(text.SelectAll);
        _selectAllButton.Click += (_, _) => SetAllSelected(true);
        _deselectAllButton = CreateSecondaryButton(text.DeselectAll);
        _deselectAllButton.Click += (_, _) => SetAllSelected(false);

        StackPanel selectionActions = new()
        {
            Orientation = Orientation.Horizontal,
            Spacing = 8,
            Children = { _selectAllButton, _deselectAllButton }
        };
        Grid selectionRow = new()
        {
            ColumnDefinitions = ColumnDefinitions.Parse("*,Auto"),
            ColumnSpacing = 12,
            Children = { _selectionSummary, selectionActions }
        };
        Grid.SetColumn(selectionActions, 1);

        _emptyState = new TextBlock
        {
            Text = text.EmptyPreview,
            Foreground = MutedBrush,
            FontSize = 16,
            TextAlignment = TextAlignment.Center,
            HorizontalAlignment = HorizontalAlignment.Center,
            VerticalAlignment = VerticalAlignment.Center,
            TextWrapping = TextWrapping.Wrap,
            Margin = new Thickness(32)
        };
        _photoGrid = new ItemsRepeater
        {
            IsVisible = false,
            Margin = new Thickness(12),
            Layout = new UniformGridLayout
            {
                MinItemWidth = 190,
                MinItemHeight = 218,
                MinColumnSpacing = 12,
                MinRowSpacing = 12
            },
            ItemTemplate = new FuncDataTemplate<PhotoSelection>(
                (photo, _) => photo is null ? new Border() : CreatePhotoCard(photo))
        };
        ScrollViewer photoScroller = new()
        {
            Content = _photoGrid,
            HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled,
            VerticalScrollBarVisibility = ScrollBarVisibility.Auto
        };
        Grid previewHost = new()
        {
            Children = { _emptyState, photoScroller }
        };
        Border previewFrame = new()
        {
            BorderBrush = HairlineBrush,
            BorderThickness = new Thickness(1),
            CornerRadius = new CornerRadius(10),
            ClipToBounds = true,
            Child = previewHost
        };
        Grid reviewContent = new()
        {
            RowDefinitions = RowDefinitions.Parse("Auto,*"),
            RowSpacing = 17,
            Children = { selectionRow, previewFrame }
        };
        Grid.SetRow(previewFrame, 1);
        Control reviewView = CreateStepPage(
            text.ReviewPageTitle,
            text.ReviewPageDescription,
            reviewContent);

        _destinationPath = new TextBlock
        {
            Text = text.NoDestinationSelected,
            Foreground = MutedBrush,
            TextTrimming = TextTrimming.CharacterEllipsis,
            VerticalAlignment = VerticalAlignment.Center
        };
        _destinationButton = CreatePrimaryButton(text.ChooseDestination);
        _destinationButton.Click += async (_, _) => await ChooseDestinationAsync();
        Grid destinationRow = new()
        {
            ColumnDefinitions = ColumnDefinitions.Parse("*,Auto"),
            ColumnSpacing = 16,
            Children = { _destinationPath, _destinationButton }
        };
        Grid.SetColumn(_destinationButton, 1);
        Control destinationView = CreateStepPage(
            text.DestinationPageTitle,
            text.DestinationPageDescription,
            destinationRow);

        _creationSummary = new TextBlock
        {
            Text = text.CreationSummary(0, "—"),
            FontSize = 16,
            TextWrapping = TextWrapping.Wrap,
            LineHeight = 26
        };
        Border summaryCard = new()
        {
            BorderBrush = HairlineBrush,
            BorderThickness = new Thickness(1),
            CornerRadius = new CornerRadius(10),
            Padding = new Thickness(22),
            Child = _creationSummary
        };
        Control createView = CreateStepPage(
            text.CreatePageTitle,
            text.CreatePageDescription,
            summaryCard);

        _stepViews = [sourceView, reviewView, destinationView, createView];
        Grid workspace = new()
        {
            Margin = new Thickness(26, 22),
            Children = { sourceView, reviewView, destinationView, createView }
        };

        _status = new TextBlock
        {
            Text = text.Ready,
            Foreground = MutedBrush,
            TextTrimming = TextTrimming.CharacterEllipsis,
            VerticalAlignment = VerticalAlignment.Center
        };
        _progress = new ProgressBar
        {
            Minimum = 0,
            Maximum = 1,
            Value = 0,
            Height = 5,
            IsVisible = false
        };
        _createButton = CreatePrimaryButton(text.CreateGallery);
        _createButton.IsEnabled = false;
        _createButton.Click += async (_, _) => await CreateGalleryAsync();
        _previousButton = CreateSecondaryButton(text.Previous);
        _previousButton.Click += (_, _) => Navigate(-1);
        _nextButton = CreatePrimaryButton(text.Next);
        _nextButton.Click += (_, _) => Navigate(1);
        StackPanel navigation = new()
        {
            Orientation = Orientation.Horizontal,
            Spacing = 9,
            Children = { _previousButton, _nextButton, _createButton }
        };

        Grid footerContent = new()
        {
            ColumnDefinitions = ColumnDefinitions.Parse("*,Auto"),
            ColumnSpacing = 18,
            Children =
            {
                new StackPanel
                {
                    Spacing = 8,
                    VerticalAlignment = VerticalAlignment.Center,
                    Children = { _status, _progress }
                },
                navigation
            }
        };
        Grid.SetColumn(navigation, 1);
        Border footer = new()
        {
            BorderBrush = HairlineBrush,
            BorderThickness = new Thickness(0, 1, 0, 0),
            Padding = new Thickness(26, 17),
            Child = footerContent
        };

        Content = new Grid
        {
            RowDefinitions = RowDefinitions.Parse("Auto,Auto,*,Auto"),
            Children = { header, _steps, workspace, footer }
        };
        Grid.SetRow(_steps, 1);
        Grid.SetRow(workspace, 2);
        Grid.SetRow(footer, 3);

        UpdateSelectionUi();
        UpdateWizardUi();
        Closed += (_, _) =>
        {
            _previewGeneration++;
            DisposePreviews();
        };
    }

    private static Button CreatePrimaryButton(string label) => new()
    {
        Content = label,
        Padding = new Thickness(18, 10),
        FontWeight = FontWeight.SemiBold,
        Background = AccentBrush,
        Foreground = Brushes.White
    };

    private static Button CreateSecondaryButton(string label) => new()
    {
        Content = label,
        Padding = new Thickness(13, 7)
    };

    private static Control CreateStepPage(string title, string description, Control content)
    {
        TextBlock heading = new()
        {
            Text = title,
            FontSize = 21,
            FontWeight = FontWeight.SemiBold
        };
        TextBlock explanation = new()
        {
            Text = description,
            Foreground = MutedBrush,
            TextWrapping = TextWrapping.Wrap
        };
        Grid page = new()
        {
            RowDefinitions = RowDefinitions.Parse("Auto,Auto,*"),
            RowSpacing = 9,
            Children = { heading, explanation, content }
        };
        Grid.SetRow(explanation, 1);
        Grid.SetRow(content, 2);
        content.Margin = new Thickness(0, 13, 0, 0);
        return page;
    }

    private Control CreatePhotoCard(PhotoSelection photo)
    {
        Avalonia.Controls.Image preview = new()
        {
            Height = 126,
            Stretch = Stretch.UniformToFill,
            HorizontalAlignment = HorizontalAlignment.Stretch,
            VerticalAlignment = VerticalAlignment.Center
        };
        Border previewFrame = new()
        {
            Height = 126,
            CornerRadius = new CornerRadius(6),
            ClipToBounds = true,
            Background = new SolidColorBrush(Color.Parse("#E2E8F0")),
            Child = preview
        };

        TextBlock fileName = new()
        {
            Text = photo.FileName,
            FontWeight = FontWeight.SemiBold,
            TextTrimming = TextTrimming.CharacterEllipsis
        };
        TextBlock fileSize = new()
        {
            Text = FormatFileSize(photo.FileSize),
            Foreground = MutedBrush,
            FontSize = 12
        };
        CheckBox selected = new()
        {
            IsChecked = photo.IsSelected,
            Content = _text.IncludePhoto,
            VerticalAlignment = VerticalAlignment.Center
        };
        Grid metadata = new()
        {
            ColumnDefinitions = ColumnDefinitions.Parse("*,Auto"),
            ColumnSpacing = 8,
            Children = { fileSize, selected }
        };
        Grid.SetColumn(selected, 1);

        Border card = new()
        {
            BorderBrush = HairlineBrush,
            BorderThickness = new Thickness(1),
            CornerRadius = new CornerRadius(9),
            Padding = new Thickness(9),
            Opacity = photo.IsSelected ? 1 : 0.58,
            Child = new StackPanel
            {
                Spacing = 8,
                Children = { previewFrame, fileName, metadata }
            }
        };
        selected.IsCheckedChanged += (_, _) =>
        {
            photo.IsSelected = selected.IsChecked == true;
            card.Opacity = photo.IsSelected ? 1 : 0.58;
            UpdateSelectionUi();
        };

        if (photo.Thumbnail is not null)
            preview.Source = photo.Thumbnail;
        else
            _ = LoadPreviewAsync(photo, preview, _previewGeneration);

        return card;
    }

    private async Task LoadPreviewAsync(
        PhotoSelection photo,
        Avalonia.Controls.Image target,
        int generation)
    {
        try
        {
            byte[] bytes = await Task.Run(() => GalleryBuilder.CreatePreview(photo.Path, 400, 260));
            if (generation != _previewGeneration)
                return;

            using MemoryStream stream = new(bytes, writable: false);
            AvaloniaBitmap bitmap = new(stream);
            if (generation != _previewGeneration)
            {
                bitmap.Dispose();
                return;
            }

            photo.Thumbnail = bitmap;
            target.Source = bitmap;
        }
        catch
        {
            // A corrupt image is reported with its filename during conversion.
        }
    }

    private async Task ChooseSourceAsync()
    {
        if (_isBusy)
            return;

        if (!StorageProvider.CanPickFolder)
        {
            await ShowMessageAsync(_text.FolderPickerUnavailableTitle, _text.FolderPickerUnavailable);
            return;
        }

        _workflowStep = 0;
        UpdateWizardUi();
        SetBusy(true, showProgress: false);
        try
        {
            string? sourceDirectory = await ChooseDirectoryAsync(_text.SourcePickerTitle);
            if (sourceDirectory is null)
                return;

            _status.Text = _text.ValidatingFolder;
            string[] invalidEntries = await Task.Run(
                () => GalleryBuilder.FindInvalidEntries(sourceDirectory));
            if (invalidEntries.Length > 0)
            {
                await ShowMessageAsync(
                    _text.FilesNotAllowedTitle,
                    _text.FilesNotAllowed + "\n\n" + string.Join(Environment.NewLine, invalidEntries));
                return;
            }

            string[] imageFiles = Directory.GetFiles(sourceDirectory)
                .Where(path => !GalleryBuilder.IsHiddenEntry(path) && GalleryBuilder.IsJpeg(path))
                .OrderBy(path => Path.GetFileName(path), StringComparer.OrdinalIgnoreCase)
                .ToArray();
            if (imageFiles.Length == 0)
            {
                await ShowMessageAsync(_text.NoImagesTitle, _text.NoImages);
                return;
            }

            ReplacePhotos(imageFiles.Select(path => new PhotoSelection(
                path,
                Path.GetFileName(path),
                new FileInfo(path).Length)).ToList());
            _sourcePath.Text = sourceDirectory;
            ToolTip.SetTip(_sourcePath, sourceDirectory);
            _status.Text = _text.PreviewReady(imageFiles.Length);
            _destinationParent = null;
            _destinationStatus = "";
            _destinationPath.Text = _text.NoDestinationSelected;
            _generationState = StepState.Pending;
        }
        catch (Exception exception)
        {
            await ShowMessageAsync(_text.ErrorTitle, exception.Message);
        }
        finally
        {
            SetBusy(false, showProgress: false);
            UpdateSelectionUi();
            UpdateWizardUi();
        }
    }

    private void Navigate(int direction)
    {
        if (_isBusy || _generationState == StepState.Completed)
            return;

        int selected = _photos.Count(photo => photo.IsSelected);
        if (direction > 0)
        {
            if ((_workflowStep == 0 && _photos.Count == 0)
                || (_workflowStep == 1 && selected == 0)
                || (_workflowStep == 2 && _destinationParent is null)
                || _workflowStep >= 3)
                return;
            _workflowStep++;
        }
        else if (_workflowStep > 0)
        {
            _workflowStep--;
            if (_generationState == StepState.Failed)
                _generationState = StepState.Pending;
        }

        UpdateWizardUi();
    }

    private async Task ChooseDestinationAsync()
    {
        if (_isBusy)
            return;

        string? destinationParent = await ChooseDirectoryAsync(_text.DestinationPickerTitle);
        if (destinationParent is null)
            return;

        string sourceDirectory = Path.GetDirectoryName(_photos[0].Path)!;
        string galleryName = new DirectoryInfo(sourceDirectory).Name;
        string outputDirectory = Path.Combine(destinationParent, galleryName);

        if (GalleryBuilder.PathsAreEqual(sourceDirectory, outputDirectory))
        {
            await ShowMessageAsync(_text.InvalidDestinationTitle, _text.InvalidDestination);
            return;
        }

        if (Directory.Exists(outputDirectory) || File.Exists(outputDirectory))
        {
            await ShowMessageAsync(_text.OutputExistsTitle, _text.OutputExists(outputDirectory));
            return;
        }

        _destinationParent = destinationParent;
        _destinationStatus = new DirectoryInfo(destinationParent).Name;
        if (string.IsNullOrWhiteSpace(_destinationStatus))
            _destinationStatus = destinationParent;
        _destinationPath.Text = outputDirectory;
        ToolTip.SetTip(_destinationPath, outputDirectory);
        _status.Text = _text.DestinationReady(outputDirectory);
        UpdateWizardUi();
    }

    private async Task CreateGalleryAsync()
    {
        string[] selectedFiles = _photos
            .Where(photo => photo.IsSelected)
            .Select(photo => photo.Path)
            .ToArray();
        if (_isBusy || selectedFiles.Length == 0 || _destinationParent is null)
            return;

        string destinationParent = _destinationParent;
        string sourceDirectory = Path.GetDirectoryName(selectedFiles[0])!;
        string galleryName = new DirectoryInfo(sourceDirectory).Name;
        string outputDirectory = Path.Combine(destinationParent, galleryName);

        if (GalleryBuilder.PathsAreEqual(sourceDirectory, outputDirectory))
        {
            await ShowMessageAsync(_text.InvalidDestinationTitle, _text.InvalidDestination);
            return;
        }

        if (Directory.Exists(outputDirectory) || File.Exists(outputDirectory))
        {
            await ShowMessageAsync(
                _text.OutputExistsTitle,
                _text.OutputExists(outputDirectory));
            _destinationParent = null;
            _destinationPath.Text = _text.NoDestinationSelected;
            _workflowStep = 2;
            UpdateWizardUi();
            return;
        }

        _generationCurrent = 0;
        _generationTotal = selectedFiles.Length;
        _generationState = StepState.Active;
        UpdateWizardUi();
        SetBusy(true, showProgress: true);
        _progress.Maximum = selectedFiles.Length;
        _progress.Value = 0;
        _status.Text = _text.PreparingImages(selectedFiles.Length);

        try
        {
            Progress<GalleryProgress> progress = new(update =>
            {
                _generationCurrent = update.Completed;
                _progress.Value = update.Completed;
                _status.Text = update.Completed >= selectedFiles.Length
                    ? _text.CompleteCount(selectedFiles.Length)
                    : _text.Processing(update.Completed, selectedFiles.Length, update.FileName);
                UpdateWizardUi();
            });

            await Task.Run(() => GalleryBuilder.Generate(
                selectedFiles,
                destinationParent,
                outputDirectory,
                galleryName,
                progress,
                _text.ProcessError));

            _status.Text = _text.GalleryCreatedAt(outputDirectory);
            _generationState = StepState.Completed;
            UpdateWizardUi();
            await ShowMessageAsync(_text.GalleryCreatedTitle, _text.GalleryCreated(outputDirectory));
        }
        catch (Exception exception)
        {
            _status.Text = _text.GenerationFailed;
            _generationState = StepState.Failed;
            UpdateWizardUi();
            await ShowMessageAsync(_text.GenerationFailed, exception.Message);
        }
        finally
        {
            SetBusy(false, showProgress: false);
            UpdateSelectionUi();
        }
    }

    private async Task<string?> ChooseDirectoryAsync(string title)
    {
        IReadOnlyList<IStorageFolder> folders = await StorageProvider.OpenFolderPickerAsync(
            new FolderPickerOpenOptions { Title = title, AllowMultiple = false });
        return folders.Count == 0 ? null : folders[0].Path.LocalPath;
    }

    private void ReplacePhotos(List<PhotoSelection> photos)
    {
        _previewGeneration++;
        DisposePreviews();
        _photos.Clear();
        _photos.AddRange(photos);
        RefreshPhotoList();
    }

    private void SetAllSelected(bool selected)
    {
        foreach (PhotoSelection photo in _photos)
            photo.IsSelected = selected;

        RefreshPhotoList();
        UpdateSelectionUi();
    }

    private void RefreshPhotoList()
    {
        _photoGrid.ItemsSource = null;
        _photoGrid.ItemsSource = _photos;
        _photoGrid.IsVisible = _photos.Count > 0;
        _emptyState.IsVisible = _photos.Count == 0;
    }

    private void UpdateSelectionUi()
    {
        int selected = _photos.Count(photo => photo.IsSelected);
        _selectionSummary.Text = _text.SelectionCount(selected, _photos.Count);
        _selectAllButton.IsEnabled = !_isBusy && selected < _photos.Count;
        _deselectAllButton.IsEnabled = !_isBusy && selected > 0;
        UpdateWizardUi();
    }

    private void UpdateWizardUi()
    {
        int selected = _photos.Count(photo => photo.IsSelected);
        string sourceReady = _text.StepSourceReady(_photos.Count);
        string reviewReady = _text.StepReviewSelected(selected);

        for (int index = 0; index < _stepViews.Length; index++)
            _stepViews[index].IsVisible = index == _workflowStep;

        _steps.SetStep(
            0,
            _workflowStep == 0 ? StepState.Active : StepState.Completed,
            _photos.Count > 0 ? sourceReady : _text.StepChoosingSource);
        _steps.SetStep(
            1,
            _workflowStep < 1 ? StepState.Pending : _workflowStep == 1 ? StepState.Active : StepState.Completed,
            _workflowStep < 1 ? _text.StepReviewWaiting : reviewReady);
        _steps.SetStep(
            2,
            _workflowStep < 2 ? StepState.Pending : _workflowStep == 2 ? StepState.Active : StepState.Completed,
            _destinationParent is null
                ? (_workflowStep == 2 ? _text.StepChoosingDestination : _text.StepDestinationWaiting)
                : _text.StepDestinationReady(_destinationStatus));

        StepState createState;
        string createDescription;
        if (_workflowStep < 3)
        {
            createState = StepState.Pending;
            createDescription = _text.StepCreateWaiting;
        }
        else
        {
            createState = _generationState == StepState.Pending ? StepState.Active : _generationState;
            createDescription = _generationState switch
            {
                StepState.Active => _text.StepCreating(_generationCurrent, _generationTotal),
                StepState.Completed => _text.StepComplete,
                StepState.Failed => _text.StepFailed,
                _ => _text.StepReadyToCreate
            };
        }
        _steps.SetStep(3, createState, createDescription);

        string outputPath = _destinationParent is null || _photos.Count == 0
            ? "—"
            : Path.Combine(_destinationParent, new DirectoryInfo(Path.GetDirectoryName(_photos[0].Path)!).Name);
        _creationSummary.Text = _text.CreationSummary(selected, outputPath);

        _previousButton.IsVisible = _workflowStep > 0;
        _previousButton.IsEnabled = !_isBusy && _generationState != StepState.Completed;
        _nextButton.IsVisible = _workflowStep < 3;
        _nextButton.IsEnabled = !_isBusy && _workflowStep switch
        {
            0 => _photos.Count > 0,
            1 => selected > 0,
            2 => _destinationParent is not null,
            _ => false
        };
        _createButton.IsVisible = _workflowStep == 3;
        _createButton.IsEnabled = !_isBusy
            && selected > 0
            && _destinationParent is not null
            && _generationState != StepState.Completed;
    }

    private void SetBusy(bool busy, bool showProgress)
    {
        _isBusy = busy;
        _sourceButton.IsEnabled = !busy;
        _destinationButton.IsEnabled = !busy;
        _photoGrid.IsEnabled = !busy;
        _progress.IsVisible = showProgress;
        UpdateSelectionUi();
    }

    private void DisposePreviews()
    {
        foreach (PhotoSelection photo in _photos)
        {
            photo.Thumbnail?.Dispose();
            photo.Thumbnail = null;
        }
    }

    private async Task ShowMessageAsync(string title, string message)
    {
        TextBox content = new()
        {
            Text = message,
            IsReadOnly = true,
            AcceptsReturn = true,
            TextWrapping = TextWrapping.Wrap,
            BorderThickness = new Thickness(0),
            MaxHeight = 380
        };
        ScrollViewer.SetVerticalScrollBarVisibility(content, ScrollBarVisibility.Auto);
        Button close = CreatePrimaryButton(_text.Ok);
        close.HorizontalAlignment = HorizontalAlignment.Right;
        close.IsDefault = true;

        Window dialog = new()
        {
            Title = title,
            Width = 570,
            Height = 300,
            MinWidth = 430,
            MinHeight = 220,
            WindowStartupLocation = WindowStartupLocation.CenterOwner,
            Content = new Grid
            {
                Margin = new Thickness(22),
                RowDefinitions = RowDefinitions.Parse("*,Auto"),
                RowSpacing = 16,
                Children = { content, close }
            }
        };
        Grid.SetRow(close, 1);
        close.Click += (_, _) => dialog.Close();
        await dialog.ShowDialog(this);
    }

    private static string FormatFileSize(long bytes)
    {
        if (bytes >= 1024L * 1024L)
            return $"{bytes / (1024d * 1024d):0.0} MB";
        return $"{Math.Max(1, bytes / 1024d):0} KB";
    }
}

internal enum StepState
{
    Pending,
    Active,
    Completed,
    Failed
}

internal sealed class StepProgress : Border
{
    private static readonly IBrush ActiveBrush = new SolidColorBrush(Color.Parse("#2563EB"));
    private static readonly IBrush CompletedBrush = new SolidColorBrush(Color.Parse("#16A34A"));
    private static readonly IBrush FailedBrush = new SolidColorBrush(Color.Parse("#DC2626"));
    private static readonly IBrush PendingBrush = new SolidColorBrush(Color.Parse("#E2E8F0"));
    private static readonly IBrush MutedBrush = new SolidColorBrush(Color.Parse("#64748B"));
    private static readonly IBrush HairlineBrush = new SolidColorBrush(Color.Parse("#CBD5E1"));

    private readonly StepVisual[] _steps;
    private readonly Border[] _connectors;

    public StepProgress(string[] titles, string[] descriptions)
    {
        BorderBrush = HairlineBrush;
        BorderThickness = new Thickness(0, 0, 0, 1);
        Padding = new Thickness(28, 15, 28, 13);

        Grid grid = new()
        {
            ColumnDefinitions = ColumnDefinitions.Parse("*,46,*,46,*,46,*")
        };
        _steps = new StepVisual[titles.Length];
        _connectors = new Border[titles.Length - 1];

        for (int index = 0; index < titles.Length; index++)
        {
            StepVisual visual = new(index + 1, titles[index], descriptions[index]);
            _steps[index] = visual;
            grid.Children.Add(visual.Root);
            Grid.SetColumn(visual.Root, index * 2);

            if (index >= titles.Length - 1)
                continue;

            Border connector = new()
            {
                Height = 2,
                Margin = new Thickness(0, 15, 0, 0),
                VerticalAlignment = VerticalAlignment.Top,
                Background = PendingBrush
            };
            _connectors[index] = connector;
            grid.Children.Add(connector);
            Grid.SetColumn(connector, index * 2 + 1);
        }

        Child = grid;
    }

    public void SetStep(int index, StepState state, string description)
    {
        StepVisual step = _steps[index];
        step.Description.Text = description;
        step.Circle.Background = state switch
        {
            StepState.Active => ActiveBrush,
            StepState.Completed => CompletedBrush,
            StepState.Failed => FailedBrush,
            _ => PendingBrush
        };
        step.Number.Text = state == StepState.Completed ? "✓" : (index + 1).ToString(CultureInfo.InvariantCulture);
        step.Number.Foreground = state == StepState.Pending
            ? MutedBrush
            : Brushes.White;
        step.Title.Foreground = state switch
        {
            StepState.Active => ActiveBrush,
            StepState.Failed => FailedBrush,
            _ => null
        };
        step.Description.Foreground = state switch
        {
            StepState.Active => ActiveBrush,
            StepState.Failed => FailedBrush,
            _ => MutedBrush
        };

        for (int connectorIndex = 0; connectorIndex < _connectors.Length; connectorIndex++)
            _connectors[connectorIndex].Background = IsCompleted(connectorIndex)
                ? CompletedBrush
                : PendingBrush;
    }

    private bool IsCompleted(int index) => _steps[index].Number.Text == "✓";

    private sealed class StepVisual
    {
        public StepVisual(int number, string title, string description)
        {
            Number = new TextBlock
            {
                Text = number.ToString(CultureInfo.InvariantCulture),
                FontWeight = FontWeight.Bold,
                FontSize = 13,
                Foreground = MutedBrush,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };
            Circle = new Border
            {
                Width = 32,
                Height = 32,
                CornerRadius = new CornerRadius(16),
                Background = PendingBrush,
                HorizontalAlignment = HorizontalAlignment.Center,
                Child = Number
            };
            Title = new TextBlock
            {
                Text = title,
                FontWeight = FontWeight.SemiBold,
                TextAlignment = TextAlignment.Center,
                TextWrapping = TextWrapping.Wrap
            };
            Description = new TextBlock
            {
                Text = description,
                FontSize = 11,
                Foreground = MutedBrush,
                TextAlignment = TextAlignment.Center,
                TextWrapping = TextWrapping.Wrap,
                MaxLines = 2
            };
            Root = new StackPanel
            {
                Spacing = 4,
                Children = { Circle, Title, Description }
            };
        }

        public StackPanel Root { get; }
        public Border Circle { get; }
        public TextBlock Number { get; }
        public TextBlock Title { get; }
        public TextBlock Description { get; }
    }
}

internal sealed class PhotoSelection(string path, string fileName, long fileSize)
{
    public string Path { get; } = path;
    public string FileName { get; } = fileName;
    public long FileSize { get; } = fileSize;
    public bool IsSelected { get; set; } = true;
    public AvaloniaBitmap? Thumbnail { get; set; }
}

internal sealed record UiText
{
    public required string WindowTitle { get; init; }
    public required string Title { get; init; }
    public required string Subtitle { get; init; }
    public required string NoSourceSelected { get; init; }
    public required string ChooseSource { get; init; }
    public required string SelectAll { get; init; }
    public required string DeselectAll { get; init; }
    public required string IncludePhoto { get; init; }
    public required string EmptyPreview { get; init; }
    public required string CreateGallery { get; init; }
    public required string Previous { get; init; }
    public required string Next { get; init; }
    public required string SourcePageTitle { get; init; }
    public required string SourcePageDescription { get; init; }
    public required string ReviewPageTitle { get; init; }
    public required string ReviewPageDescription { get; init; }
    public required string DestinationPageTitle { get; init; }
    public required string DestinationPageDescription { get; init; }
    public required string CreatePageTitle { get; init; }
    public required string CreatePageDescription { get; init; }
    public required string NoDestinationSelected { get; init; }
    public required string ChooseDestination { get; init; }
    public required string Ready { get; init; }
    public required string Ok { get; init; }
    public required string FolderPickerUnavailableTitle { get; init; }
    public required string FolderPickerUnavailable { get; init; }
    public required string SourcePickerTitle { get; init; }
    public required string DestinationPickerTitle { get; init; }
    public required string ValidatingFolder { get; init; }
    public required string FilesNotAllowedTitle { get; init; }
    public required string FilesNotAllowed { get; init; }
    public required string NoImagesTitle { get; init; }
    public required string NoImages { get; init; }
    public required string ErrorTitle { get; init; }
    public required string InvalidDestinationTitle { get; init; }
    public required string InvalidDestination { get; init; }
    public required string OutputExistsTitle { get; init; }
    public required string GalleryCreatedTitle { get; init; }
    public required string GenerationFailed { get; init; }
    public required string StepSource { get; init; }
    public required string StepReview { get; init; }
    public required string StepDestination { get; init; }
    public required string StepCreate { get; init; }
    public required string StepSourceWaiting { get; init; }
    public required string StepReviewWaiting { get; init; }
    public required string StepDestinationWaiting { get; init; }
    public required string StepCreateWaiting { get; init; }
    public required string StepChoosingSource { get; init; }
    public required string StepChoosingDestination { get; init; }
    public required string StepComplete { get; init; }
    public required string StepFailed { get; init; }
    public required string StepReadyToCreate { get; init; }
    public required Func<int, int, string> SelectionCount { get; init; }
    public required Func<int, string> PreviewReady { get; init; }
    public required Func<string, string> OutputExists { get; init; }
    public required Func<int, string> PreparingImages { get; init; }
    public required Func<int, string> CompleteCount { get; init; }
    public required Func<int, int, string, string> Processing { get; init; }
    public required Func<string, string> GalleryCreatedAt { get; init; }
    public required Func<string, string> GalleryCreated { get; init; }
    public required Func<string, string, string> ProcessError { get; init; }
    public required Func<int, string> StepSourceReady { get; init; }
    public required Func<int, string> StepReviewSelected { get; init; }
    public required Func<string, string> StepDestinationReady { get; init; }
    public required Func<int, int, string> StepCreating { get; init; }
    public required Func<string, string> DestinationReady { get; init; }
    public required Func<int, string, string> CreationSummary { get; init; }

    public static UiText ForCurrentCulture() =>
        CultureInfo.CurrentUICulture.TwoLetterISOLanguageName.Equals("pl", StringComparison.OrdinalIgnoreCase)
            ? Polish
            : English;

    private static UiText English => new()
    {
        WindowTitle = "Gallery Generator",
        Title = "Gallery Generator",
        Subtitle = "Review your photos, choose what to include, and create web-ready slides and thumbnails.",
        NoSourceSelected = "No source folder selected",
        ChooseSource = "Choose source folder",
        SelectAll = "Select all",
        DeselectAll = "Deselect all",
        IncludePhoto = "Include",
        EmptyPreview = "Choose a source folder to preview your JPEG images.",
        CreateGallery = "Create gallery",
        Previous = "Previous",
        Next = "Next",
        SourcePageTitle = "Choose the source photos",
        SourcePageDescription = "Select a folder containing the JPEG images for this gallery.",
        ReviewPageTitle = "Review the photos",
        ReviewPageDescription = "Preview the images and exclude any photos you do not want to publish.",
        DestinationPageTitle = "Choose the destination",
        DestinationPageDescription = "Select the parent folder where the new gallery folder should be created.",
        CreatePageTitle = "Create the gallery",
        CreatePageDescription = "Review the summary below, then generate the slides, thumbnails, and metadata.",
        NoDestinationSelected = "No destination folder selected",
        ChooseDestination = "Choose destination",
        Ready = "Ready",
        Ok = "OK",
        FolderPickerUnavailableTitle = "Folder picker unavailable",
        FolderPickerUnavailable = "This operating system does not provide a folder picker.",
        SourcePickerTitle = "Select the folder containing JPEG images",
        DestinationPickerTitle = "Select the destination folder",
        ValidatingFolder = "Checking the source folder…",
        FilesNotAllowedTitle = "Files not allowed",
        FilesNotAllowed = "The source folder must contain JPEG files only. Remove these entries and try again:",
        NoImagesTitle = "No images",
        NoImages = "The selected folder contains no JPEG images.",
        ErrorTitle = "Something went wrong",
        InvalidDestinationTitle = "Invalid destination",
        InvalidDestination = "The output gallery would overwrite the source folder. Select a different destination.",
        OutputExistsTitle = "Output already exists",
        GalleryCreatedTitle = "Gallery created",
        GenerationFailed = "Gallery generation failed",
        StepSource = "Source",
        StepReview = "Review",
        StepDestination = "Destination",
        StepCreate = "Create",
        StepSourceWaiting = "Choose a photo folder",
        StepReviewWaiting = "Review your photos",
        StepDestinationWaiting = "Choose where to save",
        StepCreateWaiting = "Generate gallery files",
        StepChoosingSource = "Waiting for a folder",
        StepChoosingDestination = "Select the output folder",
        StepComplete = "Gallery is ready",
        StepFailed = "Generation failed",
        StepReadyToCreate = "Ready to generate",
        SelectionCount = (selected, total) => $"{selected} of {total} photos selected",
        PreviewReady = count => $"Preview ready — {count} photos found",
        OutputExists = path => $"The output path already exists:\n\n{path}",
        PreparingImages = count => $"Preparing {count} images…",
        CompleteCount = count => $"Complete — {count} images",
        Processing = (current, total, file) => $"{current} of {total}: {file}",
        GalleryCreatedAt = path => $"Gallery created at {path}",
        GalleryCreated = path => $"Gallery created successfully:\n\n{path}",
        ProcessError = (file, error) => $"Could not process '{file}'. The file may not be a valid JPEG.\n\n{error}",
        StepSourceReady = count => $"{count} photos found",
        StepReviewSelected = count => $"{count} selected",
        StepDestinationReady = path => $"Save in {path}",
        StepCreating = (current, total) => $"{Math.Min(current, total)} of {total}",
        DestinationReady = path => $"Destination selected: {path}",
        CreationSummary = (count, path) => $"Photos: {count}\nOutput: {path}\nSlides: up to 2000 px · Thumbnails: up to 600 px · JPEG quality: 88"
    };

    private static UiText Polish => new()
    {
        WindowTitle = "Generator galerii",
        Title = "Generator galerii",
        Subtitle = "Przejrzyj zdjęcia, wybierz te, które chcesz dodać, i utwórz slajdy oraz miniatury gotowe do publikacji.",
        NoSourceSelected = "Nie wybrano folderu źródłowego",
        ChooseSource = "Wybierz folder źródłowy",
        SelectAll = "Zaznacz wszystkie",
        DeselectAll = "Odznacz wszystkie",
        IncludePhoto = "Dodaj",
        EmptyPreview = "Wybierz folder źródłowy, aby zobaczyć podgląd zdjęć JPEG.",
        CreateGallery = "Utwórz galerię",
        Previous = "Wstecz",
        Next = "Dalej",
        SourcePageTitle = "Wybierz zdjęcia źródłowe",
        SourcePageDescription = "Wybierz folder zawierający zdjęcia JPEG przeznaczone do tej galerii.",
        ReviewPageTitle = "Przejrzyj zdjęcia",
        ReviewPageDescription = "Sprawdź podgląd i odznacz zdjęcia, których nie chcesz publikować.",
        DestinationPageTitle = "Wybierz miejsce zapisu",
        DestinationPageDescription = "Wybierz folder nadrzędny, w którym zostanie utworzony nowy folder galerii.",
        CreatePageTitle = "Utwórz galerię",
        CreatePageDescription = "Sprawdź podsumowanie, a następnie wygeneruj slajdy, miniatury i metadane.",
        NoDestinationSelected = "Nie wybrano folderu docelowego",
        ChooseDestination = "Wybierz folder docelowy",
        Ready = "Gotowe",
        Ok = "OK",
        FolderPickerUnavailableTitle = "Wybór folderu jest niedostępny",
        FolderPickerUnavailable = "Ten system operacyjny nie udostępnia okna wyboru folderu.",
        SourcePickerTitle = "Wybierz folder zawierający zdjęcia JPEG",
        DestinationPickerTitle = "Wybierz folder docelowy",
        ValidatingFolder = "Sprawdzanie folderu źródłowego…",
        FilesNotAllowedTitle = "Niedozwolone pliki",
        FilesNotAllowed = "Folder źródłowy może zawierać tylko pliki JPEG. Usuń poniższe elementy i spróbuj ponownie:",
        NoImagesTitle = "Brak zdjęć",
        NoImages = "Wybrany folder nie zawiera zdjęć JPEG.",
        ErrorTitle = "Wystąpił błąd",
        InvalidDestinationTitle = "Nieprawidłowy folder docelowy",
        InvalidDestination = "Galeria wynikowa nadpisałaby folder źródłowy. Wybierz inny folder docelowy.",
        OutputExistsTitle = "Folder wynikowy już istnieje",
        GalleryCreatedTitle = "Galeria została utworzona",
        GenerationFailed = "Nie udało się utworzyć galerii",
        StepSource = "Źródło",
        StepReview = "Wybór zdjęć",
        StepDestination = "Folder docelowy",
        StepCreate = "Tworzenie",
        StepSourceWaiting = "Wybierz folder ze zdjęciami",
        StepReviewWaiting = "Przejrzyj zdjęcia",
        StepDestinationWaiting = "Wybierz miejsce zapisu",
        StepCreateWaiting = "Wygeneruj pliki galerii",
        StepChoosingSource = "Oczekiwanie na folder",
        StepChoosingDestination = "Wybierz folder wynikowy",
        StepComplete = "Galeria jest gotowa",
        StepFailed = "Tworzenie nie powiodło się",
        StepReadyToCreate = "Gotowe do utworzenia",
        SelectionCount = (selected, total) => $"Zaznaczono {selected} z {total} zdjęć",
        PreviewReady = count => $"Podgląd gotowy — znaleziono {count} zdjęć",
        OutputExists = path => $"Ścieżka wynikowa już istnieje:\n\n{path}",
        PreparingImages = count => $"Przygotowywanie {count} zdjęć…",
        CompleteCount = count => $"Gotowe — {count} zdjęć",
        Processing = (current, total, file) => $"{current} z {total}: {file}",
        GalleryCreatedAt = path => $"Galeria została utworzona w {path}",
        GalleryCreated = path => $"Galeria została utworzona:\n\n{path}",
        ProcessError = (file, error) => $"Nie udało się przetworzyć pliku „{file}”. Plik może nie być prawidłowym obrazem JPEG.\n\n{error}",
        StepSourceReady = count => $"Znaleziono {count} zdjęć",
        StepReviewSelected = count => $"Zaznaczono {count}",
        StepDestinationReady = path => $"Zapis w {path}",
        StepCreating = (current, total) => $"{Math.Min(current, total)} z {total}",
        DestinationReady = path => $"Wybrano miejsce zapisu: {path}",
        CreationSummary = (count, path) => $"Zdjęcia: {count}\nFolder wynikowy: {path}\nSlajdy: do 2000 px · Miniatury: do 600 px · Jakość JPEG: 88"
    };
}

internal static class GalleryBuilder
{
    private const int SlideMaximum = 2000;
    private const int ThumbnailMaximum = 600;
    private const int JpegQuality = 88;

    public static string[] FindInvalidEntries(string sourceDirectory) =>
        Directory.EnumerateFileSystemEntries(sourceDirectory)
            .Where(path => !IsHiddenEntry(path))
            .Where(path => Directory.Exists(path) || !IsJpeg(path))
            .Select(path => Directory.Exists(path)
                ? Path.GetFileName(path) + Path.DirectorySeparatorChar
                : Path.GetFileName(path))
            .OrderBy(name => name, StringComparer.OrdinalIgnoreCase)
            .ToArray();

    public static bool IsHiddenEntry(string path)
    {
        string name = Path.GetFileName(Path.TrimEndingDirectorySeparator(path));
        if (name.StartsWith(".", StringComparison.Ordinal))
            return true;

        try
        {
            return File.GetAttributes(path).HasFlag(FileAttributes.Hidden);
        }
        catch (IOException)
        {
            return false;
        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }
    }

    public static bool IsJpeg(string path)
    {
        string extension = Path.GetExtension(path);
        return extension.Equals(".jpg", StringComparison.OrdinalIgnoreCase)
            || extension.Equals(".jpeg", StringComparison.OrdinalIgnoreCase);
    }

    public static bool PathsAreEqual(string first, string second)
    {
        StringComparison comparison = OperatingSystem.IsWindows()
            ? StringComparison.OrdinalIgnoreCase
            : StringComparison.Ordinal;
        return string.Equals(
            Path.TrimEndingDirectorySeparator(Path.GetFullPath(first)),
            Path.TrimEndingDirectorySeparator(Path.GetFullPath(second)),
            comparison);
    }

    public static byte[] CreatePreview(string sourcePath, int maximumWidth, int maximumHeight)
    {
        using ImageSharpImage image = ImageSharpImage.Load(sourcePath);
        image.Mutate(context => context.AutoOrient());
        double scale = Math.Min(1d, Math.Min(
            (double)maximumWidth / image.Width,
            (double)maximumHeight / image.Height));
        int width = Math.Max(1, (int)Math.Round(image.Width * scale));
        int height = Math.Max(1, (int)Math.Round(image.Height * scale));
        image.Mutate(context => context.Resize(width, height, KnownResamplers.Lanczos3));

        using MemoryStream stream = new();
        image.Save(stream, new JpegEncoder { Quality = 76 });
        return stream.ToArray();
    }

    public static void Generate(
        string[] imageFiles,
        string destinationParent,
        string outputDirectory,
        string galleryName,
        IProgress<GalleryProgress> progress,
        Func<string, string, string> processError)
    {
        string temporaryDirectory = Path.Combine(destinationParent, $".{galleryName}.tmp-{Guid.NewGuid():N}");
        string slidesDirectory = Path.Combine(temporaryDirectory, "slides");
        string thumbsDirectory = Path.Combine(temporaryDirectory, "thumbs");

        Directory.CreateDirectory(slidesDirectory);
        Directory.CreateDirectory(thumbsDirectory);

        try
        {
            PhotoMetadata?[] photoResults = new PhotoMetadata?[imageFiles.Length];
            ConcurrentQueue<Exception> failures = new();
            int completed = 0;
            ParallelOptions parallelOptions = new()
            {
                MaxDegreeOfParallelism = CalculateWorkerCount()
            };

            Parallel.For(0, imageFiles.Length, parallelOptions, (index, state) =>
            {
                if (!failures.IsEmpty)
                {
                    state.Stop();
                    return;
                }

                string sourcePath = imageFiles[index];
                string fileName = Path.GetFileName(sourcePath);
                try
                {
                    photoResults[index] = ProcessImage(sourcePath, slidesDirectory, thumbsDirectory);
                    int completedCount = Interlocked.Increment(ref completed);
                    progress.Report(new GalleryProgress(completedCount, fileName));
                }
                catch (Exception exception)
                {
                    failures.Enqueue(new InvalidOperationException(
                        processError(fileName, exception.Message),
                        exception));
                    state.Stop();
                }
            });

            if (failures.TryDequeue(out Exception? failure))
                throw failure;

            List<PhotoMetadata> photos = photoResults
                .Select(photo => photo!)
                .ToList();

            GalleryMetadata metadata = new(
                1,
                galleryName,
                [new AlbumMetadata("1", "1", photos)],
                [new LinkMetadata("Strona Główna", "http://pyszstudio.pl/", "_blank", "Link to Home Page")]);

            JsonSerializerOptions jsonOptions = new()
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            string json = JsonSerializer.Serialize(metadata, jsonOptions);
            File.WriteAllText(Path.Combine(temporaryDirectory, "gallery.json"), json + Environment.NewLine,
                new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

            Directory.Move(temporaryDirectory, outputDirectory);
            progress.Report(new GalleryProgress(imageFiles.Length, "Complete"));
        }
        catch
        {
            if (Directory.Exists(temporaryDirectory))
                Directory.Delete(temporaryDirectory, recursive: true);
            throw;
        }
    }

    private static int CalculateWorkerCount()
    {
        int cpuLimit = Math.Max(1, Environment.ProcessorCount - 1);
        long availableMemory = GC.GetGCMemoryInfo().TotalAvailableMemoryBytes;
        int memoryLimit = availableMemory > 0
            ? Math.Max(1, (int)Math.Min(int.MaxValue, availableMemory / (384L * 1024L * 1024L)))
            : 4;

        return Math.Clamp(Math.Min(cpuLimit, memoryLimit), 1, 8);
    }

    private static PhotoMetadata ProcessImage(
        string sourcePath,
        string slidesDirectory,
        string thumbsDirectory)
    {
        string fileName = Path.GetFileName(sourcePath);
        string relativeSlidePath = $"slides/{fileName}";
        string relativeThumbnailPath = $"thumbs/{fileName}";
        string slidePath = Path.Combine(slidesDirectory, fileName);
        string thumbnailPath = Path.Combine(thumbsDirectory, fileName);

        using ImageSharpImage image = ImageSharpImage.Load(sourcePath);
        DateTime photoDate = ReadPhotoDate(image) ?? File.GetLastWriteTime(sourcePath);
        image.Mutate(context => context.AutoOrient());

        (int Width, int Height) slideSize = ResizeAndSave(image, slidePath, SlideMaximum);
        (int Width, int Height) thumbnailSize = ResizeAndSave(image, thumbnailPath, ThumbnailMaximum);
        long sizeInKilobytes = (long)Math.Round(
            new FileInfo(slidePath).Length / 1024d,
            MidpointRounding.AwayFromZero);

        return new PhotoMetadata(
            relativeSlidePath,
            Path.GetFileNameWithoutExtension(fileName),
            relativeSlidePath,
            relativeThumbnailPath,
            relativeSlidePath,
            slideSize.Width,
            slideSize.Height,
            thumbnailSize.Width,
            thumbnailSize.Height,
            photoDate.ToString("yyyy.MM.dd", CultureInfo.InvariantCulture),
            "",
            [],
            "",
            "JPG",
            $"{sizeInKilobytes} KB");
    }

    private static (int Width, int Height) ResizeAndSave(
        ImageSharpImage source,
        string outputPath,
        int maximumDimension)
    {
        double scale = Math.Min(1d, (double)maximumDimension / Math.Max(source.Width, source.Height));
        int width = Math.Max(1, (int)Math.Round(source.Width * scale));
        int height = Math.Max(1, (int)Math.Round(source.Height * scale));

        using ImageSharpImage output = source.Clone(
            context => context.Resize(width, height, KnownResamplers.Lanczos3));
        output.Save(outputPath, new JpegEncoder { Quality = JpegQuality });
        return (width, height);
    }

    private static DateTime? ReadPhotoDate(ImageSharpImage image)
    {
        ExifProfile? exif = image.Metadata.ExifProfile;
        string? value = null;
        if (exif?.TryGetValue(ExifTag.DateTimeOriginal, out IExifValue<string>? original) == true)
            value = original.Value;
        else if (exif?.TryGetValue(ExifTag.DateTime, out IExifValue<string>? modified) == true)
            value = modified.Value;

        return DateTime.TryParseExact(value, "yyyy:MM:dd HH:mm:ss",
            CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime result)
            ? result
            : null;
    }
}

internal sealed record GalleryProgress(int Completed, string FileName);

internal sealed record GalleryMetadata(
    int SchemaVersion,
    string Gallery,
    IReadOnlyList<AlbumMetadata> Albums,
    IReadOnlyList<LinkMetadata> Links);

internal sealed record AlbumMetadata(
    string Name,
    string Path,
    IReadOnlyList<PhotoMetadata> Photos);

internal sealed record PhotoMetadata(
    string Id,
    string Title,
    string Slide,
    string Thumbnail,
    string Download,
    int Width,
    int Height,
    int ThumbnailWidth,
    int ThumbnailHeight,
    string Date,
    string Description,
    IReadOnlyList<string> Tags,
    string Category,
    string Type,
    string SizeLabel);

internal sealed record LinkMetadata(
    string Name,
    string Url,
    string Target,
    string Description);
