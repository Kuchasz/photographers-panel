import * as React from "react";
import { Panel, Icon, Alert, Button } from "rsuite";
import "./styles.less";
import { confirm } from "../common/confirmation";
import { getBlogsList, BlogListItem, deleteBlog, getBlogVisits, BlogVisitsDto } from "@pp/api/panel/blog";
import { BlogsList } from "./blogs-list";
import { BlogCreate } from "./blog-create";
import { BlogEdit } from "./blog-edit";
import { ResultType } from "@pp/api/common";
import { BlogAssignAssets } from "./blog-assign-assets";
import { StatsChart } from "../stats-chart";
import { ChartStat } from "../stats-chart/stats";

const getStats = (x: BlogVisitsDto): ChartStat[] => [
    { label: "Today visits", value: x.todayVisits },
    { label: "Total visits", value: x.totalVisits },
    { label: "Range visits", value: x.rangeVisits },
    { label: "Best day", value: x.bestDay.date || '---' },
    { label: "Best day visits", value: x.bestDay.visits }
];

interface Props { }

interface State {
    isLoadingBlogs: boolean;
    blogs: BlogListItem[];
    selectedBlog?: BlogListItem;
    showCreateForm: boolean;
    showEditForm: boolean;
    showAssignAssets: boolean;
    blogToEditId?: number;
}

export class Blogs extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoadingBlogs: false,
            blogs: [],
            selectedBlog: undefined,
            showCreateForm: false,
            showEditForm: false,
            showAssignAssets: false,
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
                getBlogsList().then((blogs) => {
                    const selectedBlog = blogs[0];//.id;
                    this.setState({
                        blogs,
                        isLoadingBlogs: false
                    });
                    this.onBlogSelected(selectedBlog);
                });
            }
        );
    };

    onBlogSelected = (selectedBlog: BlogListItem) => {
        if (selectedBlog === this.state.selectedBlog) return;

        this.setState((_state) => ({
            selectedBlog
        }));

    };

    onBlogEdit = (selectedBlog: number) => {
        this.setState({
            blogToEditId: selectedBlog,
            showEditForm: true
        });
    };

    onVisibilityChange = (selectedBlog: number, visibility: boolean) => {
        const blog = this.state.blogs.find(b => b.id === selectedBlog);
        if (blog) {
            blog.visible = visibility;
        }
    };

    onAssignAssets = (selectedBlog: number) => {
        this.setState({
            blogToEditId: selectedBlog,
            showAssignAssets: true
        });
    };

    onBlogDelete = async (selectedBlog: number) => {
        const confirmed = await confirm("You are sure you want to remove the blog?", "Removing of blog");
        if (confirmed) {
            const result = await deleteBlog(selectedBlog);
            if (result.type === ResultType.Success) {
                Alert.success("Blog deleted.");
                this.fetchBlogs();
            } else {
                Alert.error("Blog not deleted.");
            }
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

    closeAssignAssets = () => {
        this.setState({ showAssignAssets: false });
    };

    render() {
        return (
            <div className="blogs">
                <Panel>
                    <StatsChart fetchChartStatsData={async (s, e, i) => {
                        const result = await getBlogVisits(s, e, i);
                        const stats = getStats(result);
                        const data = result.dailyVisits.map(dv => ({ date: dv.date, value: dv.visits }));
                        return { data, stats };
                    }} selectedItem={this.state.selectedBlog!} />
                </Panel>
                <div className="list">
                    <Panel
                        header={
                            <Button onClick={this.showCreateForm} color="green">
                                <Icon icon="plus" /> Create Blog
                            </Button>
                        }
                    >
                        <BlogsList
                            blogs={this.state.blogs}
                            loadingBlogs={this.state.isLoadingBlogs}
                            onSelect={this.onBlogSelected}
                            onEdit={this.onBlogEdit}
                            onAssignAssets={this.onAssignAssets}
                            onDelete={this.onBlogDelete}
                            onVisibilityChange={this.onVisibilityChange}
                        />
                    </Panel>
                </div>
                <BlogCreate
                    onAdded={this.fetchBlogs}
                    showCreateForm={this.state.showCreateForm}
                    closeCreateForm={this.closeCreateForm}
                />
                {this.state.blogToEditId ? (
                    <BlogEdit
                        onSaved={this.fetchBlogs}
                        showEditForm={this.state.showEditForm}
                        closeEditForm={this.closeEditForm}
                        id={this.state.blogToEditId}
                    />
                ) : null}
                {this.state.blogToEditId ? (
                    <BlogAssignAssets
                        showBlogAssignAssets={this.state.showAssignAssets}
                        closeAssignAssets={this.closeAssignAssets}
                        id={this.state.blogToEditId}
                    />
                ) : null}
            </div>
        );
    }
}
