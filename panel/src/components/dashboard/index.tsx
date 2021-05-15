import { ResultType } from '@pp/api/common';
import { BlogSelectItem, changeMainBlogs, getBlogSelectList, getMainBlogs, MainBlogsDto } from '@pp/api/panel/blog';
import { getSiteEvents, SiteEventDto } from '@pp/api/panel/site';
import { EventDto, getEventsList } from '@pp/api/event';
import * as React from 'react';
import { Alert, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, HelpBlock, Icon, List, SelectPicker } from 'rsuite';
import { FormInstance } from 'rsuite/lib/Form';
import { translations } from '../../i18n';
import { mainBlogsModel } from './main-blogs-model';

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
};

const slimText = {
    fontSize: '0.666em',
    color: '#97969B',
    fontWeight: 'lighter',
    paddingBottom: 5,
} as const;

const titleStyle = {
    paddingBottom: 5,
    whiteSpace: 'nowrap',
    fontWeight: 500,
} as const;

// const dataStyle = {
//     fontSize: '1.2em',
//     fontWeight: 500,
// };

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
            <List hover>
                {newEvents.map((item, index) => (
                    <List.Item key={index} index={index + 1}>
                        <FlexboxGrid>
                            {/*icon*/}
                            {/* <FlexboxGrid.Item colspan={2} style={styleCenter}>
                                {React.cloneElement(item['icon'], {
                                    style: {
                                        color: 'darkgrey',
                                        fontSize: '1.5em',
                                    },
                                })}
                            </FlexboxGrid.Item> */}
                            {/*base info*/}
                            <FlexboxGrid.Item
                                colspan={6}
                                style={{
                                    ...styleCenter,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    overflow: 'hidden',
                                }}>
                                <div style={titleStyle}>{item.type}</div>
                                <div style={slimText}>
                                    <div>
                                        <Icon icon="user-circle-o"/>
                                        {' ' + item.user}
                                    </div>
                                    <div>{item.occuredOn}</div>
                                </div>
                            </FlexboxGrid.Item>
                            {/*peak data*/}
                            {/* <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={slimText}>Peak</div>
                                    <div style={dataStyle}>{item['peak'].toLocaleString()}</div>
                                </div>
                                {this.renderRaise(item['peakRaise'])}
                            </FlexboxGrid.Item> */}
                            {/*uv data*/}
                            {/* <FlexboxGrid.Item colspan={6} style={styleCenter}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={slimText}>User visits (UV)</div>
                                    <div style={dataStyle}>{item['uv'].toLocaleString()}</div>
                                </div>
                                {this.renderRaise(item['uvRaise'])}
                            </FlexboxGrid.Item> */}
                            {/*uv data*/}
                            {/* <FlexboxGrid.Item
                                colspan={4}
                                style={{
                                    ...styleCenter,
                                }}>
                                <a href="#">View</a>
                                <span style={{ padding: 5 }}>|</span>
                                <a href="#">Edit</a>
                            </FlexboxGrid.Item> */}
                        </FlexboxGrid>
                    </List.Item>
                ))}
            </List>
        </>
    );
};
