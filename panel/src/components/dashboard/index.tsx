import { ResultType } from '@pp/api/common';
import { BlogSelectItem, changeMainBlogs, getBlogSelectList, getMainBlogs, MainBlogsDto } from '@pp/api/panel/blog';
import { getSiteEvents, SiteEventDto } from '@pp/api/panel/site';
import { EventDto, getEventsList } from '@pp/api/event';
import * as React from 'react';
import { Alert, ControlLabel, Form, FormControl, FormGroup, HelpBlock, SelectPicker } from 'rsuite';
import { FormInstance } from 'rsuite/lib/Form';
import { translations } from '../../i18n';
import { mainBlogsModel } from './main-blogs-model';

type Props = {};

const emptyMainBlogs = () => ({
    leftBlog: undefined,
    rightBlog: undefined,
});

export const Dashboard = (props: Props) => {
    const [formState, setFormState] = React.useState<MainBlogsDto>(emptyMainBlogs());
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const [events, setEvents] = React.useState<SiteEventDto[]>([]);
    const [newEvents, setNewEvents] = React.useState<EventDto[]>([]);
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    React.useEffect(() => {
        getMainBlogs().then(setFormState);
    }, []);

    React.useEffect(() => {
        getSiteEvents().then(setEvents);
    }, []);

    React.useEffect(() => {
        getEventsList().then(setNewEvents);
    }, []);

    const _changeMainBlogs = (b: MainBlogsDto) => {
        setFormState(b);

        if (formRef.current) {
            const formIsValid = formRef.current.check();
            if (!formIsValid) return;
            changeMainBlogs(b).then((result) => {
                if (result.type === ResultType.Success) {
                    Alert.success(translations.dashboard.mainBlogs.edited);
                } else {
                    Alert.error(translations.dashboard.mainBlogs.notEdited);
                }
            });
        }
    };

    return (
        <>
            <Form ref={formRef} model={mainBlogsModel} formValue={formState} onChange={_changeMainBlogs}>
                <FormGroup>
                    <ControlLabel>{translations.dashboard.mainBlogs.leftBlog.label}</ControlLabel>
                    <FormControl
                        name="leftBlog"
                        style={{ width: 300 }}
                        accepter={SelectPicker}
                        placement="topEnd"
                        searchable={true}
                        data={blogs}
                    />
                    <HelpBlock tooltip>{translations.dashboard.mainBlogs.leftBlog.hint}</HelpBlock>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>{translations.dashboard.mainBlogs.rightBlog.label}</ControlLabel>
                    <FormControl
                        name="rightBlog"
                        style={{ width: 300 }}
                        accepter={SelectPicker}
                        placement="topEnd"
                        searchable={true}
                        data={blogs}
                    />
                    <HelpBlock tooltip>{translations.dashboard.mainBlogs.rightBlog.hint}</HelpBlock>
                </FormGroup>
            </Form>
            <ul>
                {events.map((e) => (
                    <li key={e.idsubdatatable}>
                        {e.label}: {e.nb_events}
                    </li>
                ))}
            </ul>
            <ul>
                {newEvents.map((e) => (
                    <li key={e.occuredOn.getTime()}>
                        {e.occuredOn}, {e.type}, {e.user}
                    </li>
                ))}
            </ul>
        </>
    );
};
