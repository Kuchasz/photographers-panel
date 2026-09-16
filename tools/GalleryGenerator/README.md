# Gallery Generator

A cross-platform desktop utility for macOS and Windows that turns a flat directory of JPEG images into the gallery layout used by `gallery.json`:

```text
gallery-name/
  gallery.json
  slides/
    original-name.jpg
  thumbs/
    original-name.jpg
```

After clicking **Select source folder**, the app asks for:

1. A source folder containing only `.jpg` or `.jpeg` files. Hidden entries such as `.DS_Store` are ignored; visible subdirectories and all other files are rejected and listed.
2. A destination parent folder. The app creates a child folder with the same name as the source folder.

Before choosing the destination, the app displays a responsive, scrollable grid of photo cards with thumbnails, filenames, and file sizes. Individual images can be included or excluded, with additional **Select all** and **Deselect all** actions. The interface automatically uses Polish when the operating system UI language is Polish; English is used for all other system languages.

A four-stage wizard at the top tracks **Source**, **Review**, **Destination**, and **Create**. Each stage has its own focused view, with **Previous** and **Next** navigation. Localized descriptions update with discovered and selected photo counts, destination choice, generation progress, completion, and errors.

Slides have a maximum width or height of 2000 px, thumbnails 600 px, and both use JPEG quality 88. Images are never enlarged. EXIF orientation is applied, and the metadata date uses EXIF `DateTimeOriginal` where available (otherwise the source file's modified date).

Image decoding, resizing, and JPEG encoding run in parallel. The worker count adapts to available processors and memory, leaves one processor available for the interface, and is capped at eight concurrent images to avoid excessive memory use. Output metadata remains in the original filename order.

## Run during development

```bash
dotnet run --project tools/GalleryGenerator/GalleryGenerator.csproj
```

## Publish a single native executable

Run the command for the target computer:

```bash
# Apple Silicon macOS
dotnet publish tools/GalleryGenerator/GalleryGenerator.csproj -c Release -r osx-arm64

# Intel macOS
dotnet publish tools/GalleryGenerator/GalleryGenerator.csproj -c Release -r osx-x64

# 64-bit Windows
dotnet publish tools/GalleryGenerator/GalleryGenerator.csproj -c Release -r win-x64

# 32-bit Windows
dotnet publish tools/GalleryGenerator/GalleryGenerator.csproj -c Release -r win-x86
```

The self-contained output is written beneath:

```text
tools/GalleryGenerator/bin/Release/net8.0/<runtime>/publish/
```

macOS may block an unsigned downloaded binary. For local builds, right-click the app or executable and select **Open**. Distribution to other Macs should use an app bundle with code signing and notarization.
