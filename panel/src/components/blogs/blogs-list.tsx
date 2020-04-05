import React, { useState } from "react";
import { BlogListItem, changeBlogVisibility } from "../../../../api/panel/blog";
import { Table, Whisper, Icon, IconButton, ButtonToolbar, Tooltip, Divider } from "rsuite";

interface Props {
    onSelect: (id: number) => void;
    onEdit: (id: number) => void;
    onAssignAssets: (id: number) => void;
    onDelete: (id: number) => void;
    blogs: BlogListItem[];
    loadingBlogs: boolean;
}

interface State {
    isChangingVisibility: boolean;
}

type BlogIconProps = { id: number; initialVisibility: boolean };

const BlogIcon = ({ id, initialVisibility }: BlogIconProps) => {
    const [visible, setVisible] = useState(initialVisibility);
    const [isLoading, setIsLoading] = useState(false);

    const onChangeBlogVisibility = () => {
        setIsLoading(true);
        changeBlogVisibility({ id, shouldBeVisible: !visible }).then(result => {
            setVisible(!visible);
            setIsLoading(false);
        });
    };

    return (
        <Whisper
            onClick={onChangeBlogVisibility}
            trigger="hover"
            speaker={
                <Tooltip>
                    Blog is <i>{visible ? "visible" : "hidden"}</i>
                </Tooltip>
            }
        >
            <IconButton
                style={{ color: visible ? "#4CAF50" : "#F44336" }}
                loading={isLoading}
                appearance="subtle"
                icon={<Icon icon={visible ? "eye" : "eye-slash"} />}
            />
        </Whisper>
    );
};

export class BlogsList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isChangingVisibility: false };
    }

    render() {
        return (
            <Table
                rowHeight={50}
                virtualized={true}
                loading={this.props.loadingBlogs}
                height={700}
                onRowClick={(item: any) => this.props.onSelect(item.id)}
                data={this.props.blogs}
            >
                <Table.Column width={100} align="center">
                    <Table.HeaderCell>Visibility</Table.HeaderCell>
                    <Table.Cell dataKey="visible" className="link-group">
                        {(blog: BlogListItem) => <BlogIcon id={blog.id} initialVisibility={blog.visible} />}
                    </Table.Cell>
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>Visits</Table.HeaderCell>
                    <Table.Cell dataKey="visits" />
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>Comments</Table.HeaderCell>
                    <Table.Cell dataKey="comments" />
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.Cell dataKey="date" />
                </Table.Column>

                <Table.Column flexGrow={1} width={200}>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.Cell dataKey="title" />
                </Table.Column>

                <Table.Column flexGrow={1} width={200}>
                    <Table.HeaderCell>Content</Table.HeaderCell>
                    <Table.Cell dataKey="content" />
                </Table.Column>

                <Table.Column width={200} align="center" fixed="right">
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                    <Table.Cell className="link-group">
                        {(blog: BlogListItem) => (
                            <ButtonToolbar>
                                <IconButton icon={<Icon icon="edit2" />} onClick={() => this.props.onEdit(blog.id)} />
                                <Divider vertical />
                                <IconButton
                                    icon={<Icon icon="trash2" />}
                                    onClick={() => this.props.onDelete(blog.id)}
                                />
                                <Divider vertical />
                                <IconButton
                                    icon={<Icon icon="th-large" />}
                                    onClick={() => this.props.onAssignAssets(blog.id)}
                                />
                            </ButtonToolbar>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        );
    }
}
