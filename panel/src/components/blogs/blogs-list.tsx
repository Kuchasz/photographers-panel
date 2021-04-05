import React, { useState } from 'react';
import { BlogListItem, changeBlogVisibility } from '@pp/api/panel/blog';
import { Table, Icon, IconButton, ButtonToolbar, Divider } from 'rsuite';
import { ToolTip } from '../common/tooltip';
import { translations } from '../../i18n';

interface Props {
    onSelect: (item: any) => void;
    onEdit: (id: number) => void;
    onAssignAssets: (id: number) => void;
    onVisibilityChange: (id: number, visibility: boolean) => void;
    onDelete: (id: number) => void;
    blogs: BlogListItem[];
    loadingBlogs: boolean;
}

interface State {
    isChangingVisibility: boolean;
}

type VisibilityIconProps = {
    id: number;
    initialVisibility: boolean;
    onVisibilityChange: (visibility: boolean) => void;
};

const VisibilityIcon = ({ id, initialVisibility, onVisibilityChange }: VisibilityIconProps) => {
    const [visible, setVisible] = useState<boolean>(initialVisibility);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        setVisible(initialVisibility);
    }, [id]);

    const onChangeBlogVisibility = () => {
        setIsLoading(true);
        changeBlogVisibility({ id, shouldBeVisible: !visible }).then((result) => {
            onVisibilityChange(!visible);
            setVisible(!visible);
            setIsLoading(false);
        });
    };

    return (
        <ToolTip
            text={
                <>
                    {translations.blog.list.visibilityTooltip}{' '}
                    <i>{visible ? translations.blog.list.visible : translations.blog.list.hidden}</i>
                </>
            }>
            <IconButton
                onClick={onChangeBlogVisibility}
                style={{ color: visible ? '#4CAF50' : '#F44336' }}
                loading={isLoading}
                appearance="subtle"
                icon={<Icon icon={visible ? 'eye' : 'eye-slash'} />}
            />
        </ToolTip>
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
                shouldUpdateScroll={true}
                onDataUpdated={() => {}}
                loading={this.props.loadingBlogs}
                height={400}
                onRowClick={(item: any) => this.props.onSelect(item)}
                data={this.props.blogs}>
                <Table.Column width={100} align="center">
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.Cell className="link-group">
                        {(blog: BlogListItem) => (
                            <VisibilityIcon
                                onVisibilityChange={(visibility) => this.props.onVisibilityChange(blog.id, visibility)}
                                id={blog.id}
                                initialVisibility={blog.visible}
                            />
                        )}
                    </Table.Cell>
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>{translations.blog.list.headers.visits}</Table.HeaderCell>
                    <Table.Cell dataKey="visits" />
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>{translations.blog.list.headers.comments}</Table.HeaderCell>
                    <Table.Cell dataKey="comments" />
                </Table.Column>

                <Table.Column width={100} align="center">
                    <Table.HeaderCell>{translations.blog.list.headers.date}</Table.HeaderCell>
                    <Table.Cell dataKey="date" />
                </Table.Column>

                <Table.Column flexGrow={1} width={200}>
                    <Table.HeaderCell>{translations.blog.list.headers.title}</Table.HeaderCell>
                    <Table.Cell dataKey="title" />
                </Table.Column>

                <Table.Column flexGrow={1} width={200}>
                    <Table.HeaderCell>{translations.blog.list.headers.content}</Table.HeaderCell>
                    <Table.Cell dataKey="content" />
                </Table.Column>

                <Table.Column width={200} align="center" fixed="right">
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.Cell className="link-group">
                        {(blog: BlogListItem) => (
                            <ButtonToolbar>
                                <ToolTip placement="left" text={translations.blog.list.actions.edit}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<Icon icon="edit2" />}
                                        onClick={() => this.props.onEdit(blog.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={translations.blog.list.actions.delete}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<Icon icon="trash2" />}
                                        onClick={() => this.props.onDelete(blog.id)}
                                    />
                                </ToolTip>
                                <Divider vertical />
                                <ToolTip placement="left" text={translations.blog.list.actions.assignAssets}>
                                    <IconButton
                                        appearance="subtle"
                                        icon={<Icon icon="th-large" />}
                                        onClick={() => this.props.onAssignAssets(blog.id)}
                                    />
                                </ToolTip>
                            </ButtonToolbar>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        );
    }
}
