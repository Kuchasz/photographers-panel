import * as React from "react";
import {
    Button,
    Message,
    Panel,
    useToaster
} from "rsuite";
import { Plus } from '@phosphor-icons/react';
import { BlogAssignAssetsModal } from "./blog-assign-assets-modal";
import { BlogCreate } from "./blog-create";
import { BlogEdit } from "./blog-edit";
import {
    BlogListItem,
    BlogVisitsDto,
    deleteBlog,
    getBlogsList,
    getBlogVisits
} from "@pp/api/dist/panel/blog";
import { BlogsList } from "./blogs-list";
import { ChartStat } from "../stats-chart/stats";
import { confirm } from "../common/confirmation";
import { ResultType } from "@pp/api/dist/common";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { StatsChart } from "../stats-chart";
import { translations } from "../../i18n";
import "./styles.less";

const getStats = (x: BlogVisitsDto): ChartStat[] => [
    { label: translations.blog.stats.todayVisits, value: x.todayVisits },
    { label: translations.blog.stats.totalVisits, value: x.totalVisits },
    { label: translations.blog.stats.rangeVisits, value: x.rangeVisits },
    { label: translations.blog.stats.bestDay, value: x.bestDay.date || '---' },
    { label: translations.blog.stats.bestDayVisits, value: x.bestDay.visits },
];

export const Blogs: React.FC = () => {
    const [isLoadingBlogs, setIsLoadingBlogs] = React.useState(false);
    const [blogs, setBlogs] = React.useState<BlogListItem[]>([]);
    const [selectedBlog, setSelectedBlog] = React.useState<BlogListItem>();
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const [showEditForm, setShowEditForm] = React.useState(false);
    const [showAssignAssets, setShowAssignAssets] = React.useState(false);
    const [blogToEditId, setBlogToEditId] = React.useState<number>();

    const navigate = useNavigate();
    const toaster = useToaster();

    const fetchBlogs = React.useCallback(() => {
        setIsLoadingBlogs(true);
        getBlogsList().then((blogs) => {
            setBlogs(blogs);
            setIsLoadingBlogs(false);
            onBlogSelected(blogs[0]);
        });
    }, []);

    React.useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const onBlogSelected = (selectedBlog: BlogListItem) => {
        if (selectedBlog === selectedBlog) return;
        setSelectedBlog(selectedBlog);
    };

    const onBlogEdit = (selectedBlog: number) => {
        setBlogToEditId(selectedBlog);
        setShowEditForm(true);
    };

    const onVisibilityChange = (selectedBlog: number, visibility: boolean) => {
        setBlogs(prevBlogs => 
            prevBlogs.map(blog => 
                blog.id === selectedBlog 
                    ? { ...blog, visible: visibility }
                    : blog
            )
        );
    };

    const onAssignAssets = (selectedBlog: number) => {
        navigate(routes.blog.assets.replace(':id', String(selectedBlog)));
    };

    const onBlogDelete = async (selectedBlog: number) => {
        const confirmed = await confirm(
            translations.blog.delete.confirmationContent,
            translations.blog.delete.confirmationHeader
        );
        if (confirmed) {
            const result = await deleteBlog(selectedBlog);
            if (result.type === ResultType.Success) {
                toaster.push(
                    <Message type="success">{translations.blog.delete.deleted}</Message>
                );
                fetchBlogs();
            } else {
                toaster.push(
                    <Message type="error">{translations.blog.delete.notDeleted}</Message>
                );
            }
        }
    };

    const closeCreateForm = () => setShowCreateForm(false);
    const showCreateFormHandler = () => setShowCreateForm(true);
    const closeEditForm = () => setShowEditForm(false);
    const closeAssignAssets = () => setShowAssignAssets(false);

    return (
        <div className="blogs">
            <Panel>
                <StatsChart
                    fetchChartStatsData={async (s, e, i) => {
                        const result = await getBlogVisits(s, e, i);
                        const stats = getStats(result);
                        const data = result.dailyVisits.map((dv) => ({
                            date: dv.date,
                            value: dv.visits,
                        }));
                        return { data, stats };
                    }}
                    selectedItem={selectedBlog!}
                />
            </Panel>
            <div className="list">
                <Panel
                    header={
                        <Button onClick={showCreateFormHandler} color="green">
                            <Plus size={16} /> {translations.blog.create.button}
                        </Button>
                    }>
                    <BlogsList
                        blogs={blogs}
                        loadingBlogs={isLoadingBlogs}
                        onSelect={onBlogSelected}
                        onEdit={onBlogEdit}
                        onAssignAssets={onAssignAssets}
                        onDelete={onBlogDelete}
                        onVisibilityChange={onVisibilityChange}
                    />
                </Panel>
            </div>
            <BlogCreate
                onAdded={fetchBlogs}
                showCreateForm={showCreateForm}
                closeCreateForm={closeCreateForm}
            />
            {blogToEditId && (
                <BlogEdit
                    onSaved={fetchBlogs}
                    showEditForm={showEditForm}
                    closeEditForm={closeEditForm}
                    id={blogToEditId}
                />
            )}
            {blogToEditId && (
                <BlogAssignAssetsModal
                    showBlogAssignAssets={showAssignAssets}
                    closeAssignAssets={closeAssignAssets}
                    id={blogToEditId}
                />
            )}
        </div>
    );
};
