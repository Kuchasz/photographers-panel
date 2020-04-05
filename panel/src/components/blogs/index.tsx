import * as React from "react";
import { Panel, Icon, IconButton, Alert } from "rsuite";
import { addMonths } from "../../../../utils/date";
import "./styles.less";
import { confirm } from "../common/confirmation";
import { getBlogsList, BlogListItem } from "../../../../api/panel/blog";
import { BlogsList } from "./blogs-list";
import { BlogCreate } from "./blog-create";

interface Props {}

interface State {
    isLoading: boolean;
    isLoadingBlogs: boolean;
    // visits: VisitsSummary[];
    blogs: BlogListItem[];
    selectedBlog?: number;
    stats?: {
        todayVisits: number;
        totalVisits: number;
        bestDay: string;
        bestDayVisits: number;
        rangeDays: number;
        rangeVisits: number;
        emails: number;
    };
    startDate: Date;
    endDate: Date;
    disableAutoDate: boolean;
    showCreateForm: boolean;
    showEditForm: boolean;
    blogToEditId?: number;
}

export class Blogs extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            // visits: [],
            isLoading: false,
            isLoadingBlogs: false,
            blogs: [],
            stats: undefined,
            selectedBlog: undefined,
            startDate: addMonths(new Date(), -1),
            endDate: new Date(),
            disableAutoDate: false,
            showCreateForm: false,
            showEditForm: false,
            blogToEditId: undefined
        };
    }

    componentDidMount() {
        this.fetchBlogs();
    }

    fetchBlogs = () => {
        this.setState(
            () => ({ isLoadingBlogs: true }),
            () => {
                getBlogsList().then(blogs => {

                    const selectedBlog = blogs[0].id;
                    this.setState({
                        blogs,
                        isLoadingBlogs: false
                    });
                    this.onBlogSelected(selectedBlog);
                });
            }
        );
    };

    onDateRangeChanged = ([startDate, endDate]: [(Date | undefined)?, (Date | undefined)?]) => {
        if (startDate === undefined || endDate === undefined) return;
        this.setState(() => ({ disableAutoDate: true, startDate, endDate }));
        if (this.state.selectedBlog) {
            this.setState(_state => ({
                isLoading: true
            }));

            // getGalleryVisits(startDate, endDate, this.state.selectedBlog).then(resp =>
            //     this.setState({ isLoading: false, stats: getStats(resp), visits: resp.dailyVisits })
            // );
        }
    };

    toggleRandom = () => {
        this.setState(({ disableAutoDate: autoDate }) => ({ disableAutoDate: !autoDate }));
    };

    onBlogSelected = (selectedBlog: number) => {
        if (selectedBlog === this.state.selectedBlog) return;

        const blog = this.state.blogs.filter(x => x.id === selectedBlog)[0];

        const startDate = this.state.disableAutoDate ? this.state.startDate : new Date(blog.date);
        const endDate = this.state.disableAutoDate ? this.state.endDate : addMonths(new Date(blog.date), 1);

        this.setState(_state => ({
            isLoading: true,
            startDate,
            endDate,
            selectedBlog
        }));

        // getGalleryVisits(startDate, endDate, selectedBlog).then(resp =>
        //     this.setState({ isLoading: false, stats: getStats(resp), visits: resp.dailyVisits })
        // );
    };

    onBlogEdit = (selectedBlog: number) => {
        this.setState({
            blogToEditId: selectedBlog,
            showEditForm: true
        });
    };

    onBlogDelete = async (selectedGallery: number) => {
        const confirmed = await confirm("You are sure you want to remove the blog?", "Removing of blog");
        if (confirmed) {
            // const result = await deleteGallery(selectedGallery);
            // if (result.type === ResultType.Success) {
            Alert.success("Blog deleted.");
            //     this.fetchBlogs();
            // } else {
            //     Alert.error("Blog not deleted.");
            // }
        }
    };

    closeCreateForm = () => {
        this.setState({ showCreateForm: false });
    };

    showCreateForm = () => {
        this.setState({ showCreateForm: true });
    };

    closeEditForm = () => {
        this.setState({ showEditForm: false });
    };

    showEditForm = () => {
        this.setState({ showEditForm: true });
    };

    render() {
        return (
            <div className="blogs">
                <div className="visits">
                    {/* <Panel>
                        <header>
                            <GalleryVisitRange
                                onAutoChanged={this.toggleRandom}
                                autoDisabled={this.state.disableAutoDate}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onRangeChange={this.onDateRangeChanged}
                            />
                            <span>
                                {this.state.stats != null ? (
                                    <GalleryStats isLoading={this.state.isLoading} {...this.state.stats} />
                                ) : null}
                            </span>
                        </header>
                        <GalleryChart visits={this.state.visits}></GalleryChart>
                    </Panel> */}
                </div>
                <div className="list">
                    <Panel
                        header={
                            <span>
                                Blogs
                                <IconButton onClick={this.showCreateForm} icon={<Icon icon="plus" />} color="green" />
                            </span>
                        }
                    >
                        <BlogsList
                            blogs={this.state.blogs}
                            loadingBlogs={this.state.isLoadingBlogs}
                            onSelect={this.onBlogSelected}
                            onEdit={this.onBlogEdit}
                            onDelete={this.onBlogDelete}
                        />
                    </Panel>
                </div>
                <BlogCreate
                    onAdded={this.fetchBlogs}
                    showCreateForm={this.state.showCreateForm}
                    closeCreateForm={this.closeCreateForm}
                />
                {/* {this.state.blogToEditId ? (
                    <GalleryEdit
                        onSaved={this.fetchBlogs}
                        showEditForm={this.state.showEditForm}
                        closeEditForm={this.closeEditForm}
                        id={this.state.blogToEditId}
                    />
                ) : null} */}
            </div>
        );
    }
}
