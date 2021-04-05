import { ResultType } from '@pp/api/common';
import { BlogSelectItem, changeMainBlogs, getBlogSelectList, getMainBlogs, MainBlogsDto } from '@pp/api/panel/blog';
import * as React from 'react';
import { Alert, ControlLabel, Form, FormControl, FormGroup, HelpBlock, SelectPicker } from 'rsuite';
import { FormInstance } from 'rsuite/lib/Form';
import { config } from '../../config';
import { translations } from '../../i18n';
import { mainBlogsModel } from './main-blogs-model';

type Props = {};

const emptyMainBlogs = () => ({
    leftBlog: undefined,
    rightBlog: undefined,
});

const eventsReportUrl = () =>
    `${config.stats.urlBase}/index.php?module=API&method=Events.getAction&idSite=${config.stats.siteId}&period=month&date=today&format=JSON&token_auth=${config.stats.authToken}&force_api_session=1`;

export const Dashboard = (props: Props) => {
    const [formState, setFormState] = React.useState<MainBlogsDto>(emptyMainBlogs());
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const [report, setReport] = React.useState<string>('');
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    React.useEffect(() => {
        getMainBlogs().then(setFormState);
    }, []);

    React.useEffect(() => {
        fetch(eventsReportUrl())
            .then((x) => x.json())
            .then((x) => setReport(JSON.stringify(x)));
    });

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
            <p>{report}</p>
        </>
    );
};
