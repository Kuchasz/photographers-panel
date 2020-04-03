import React from "react";
import { BlogListItem } from "../../../../api/panel/blog";
import { Table, Whisper, Icon, ButtonToolbar, Button, Tooltip } from "rsuite";

interface Props {
    onSelect: (item: any) => void;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    blogs: BlogListItem[];
    loadingBlogs: boolean;
}
interface State {}

const VisibleBlogIcon = () => (
    <Whisper
        trigger="hover"
        speaker={
            <Tooltip>
                Blog is <i>visible</i>.
            </Tooltip>
        }
    >
        <Icon icon="eye" style={{ color: "#4CAF50" }} />
    </Whisper>
);

const HiddenBlogIcon = () => (
    <Whisper
        trigger="hover"
        speaker={
            <Tooltip>
                Blog is <i>hidden</i>.
            </Tooltip>
        }
    >
        <Icon icon="eye-slash" style={{ color: "#F44336" }} />
    </Whisper>
);

export class BlogsList extends React.PureComponent<Props, State> {
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
                    <Table.Cell dataKey="visible">
                        {(blog: BlogListItem) => (blog.visible ? <VisibleBlogIcon /> : <HiddenBlogIcon />)}
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

                <Table.Column width={150} fixed="right">
                    <Table.HeaderCell />
                    <Table.Cell>
                        {(blog: BlogListItem) => (
                            <ButtonToolbar>
                                <Button size="xs" onClick={() => this.props.onEdit(blog.id)}>
                                    <Icon icon="edit2" /> Edit
                                </Button>
                                <Button size="xs" onClick={() => this.props.onDelete(blog.id)}>
                                    <Icon icon="trash2" /> Delete
                                </Button>
                            </ButtonToolbar>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        );
    }
}
