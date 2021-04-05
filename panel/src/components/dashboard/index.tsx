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

const eventsRaportUrl = () =>
    `//${config.stats.urlBase}/index.php?module=Widgetize&action=iframe&secondaryDimension=eventName&disableLink=0&widget=1&moduleToWidgetize=Events&actionToWidgetize=getAction&idSite=${config.stats.siteId}&period=day&date=2021-04-05&disableLink=1&widget=1`;

export const Dashboard = (props: Props) => {
    const [formState, setFormState] = React.useState<MainBlogsDto>(emptyMainBlogs());
    const [blogs, setBlogs] = React.useState<BlogSelectItem[]>([]);
    const formRef = React.useRef<FormInstance>();

    React.useEffect(() => {
        getBlogSelectList().then(setBlogs);
    }, []);

    React.useEffect(() => {
        getMainBlogs().then(setFormState);
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
            <div style={{ width: '100%', height: '100%' }} id="widgetIframe">
                <iframe
                    width="100%"
                    height="100%"
                    src={eventsRaportUrl()}
                    scrolling="yes"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}></iframe>
            </div>
        </>
    );
};
