
import React, { FC, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import BtnPage from './btn-page';
import { useSelector } from 'react-redux';
import { IStoreState } from '../../../reducers/storeState/storeReducer';
import { difference, intersection } from 'lodash';

interface Props {
    items: any[];
    pages: any[];
    pageActive: any;
    handleSelectPage: (page: any) => void;
    setItems: (items: any) => void;
    setPagesHide: (pages: any) => void;
}


const Pages: FC<Props> = ({ items, pages, pageActive, handleSelectPage, setItems, setPagesHide }): JSX.Element => {
    const storeId = useSelector(({ store }: { store: IStoreState }) => store.store._id);

    useEffect(() => {
        const data = localStorage.getItem('pages-setting');
        if (data) {
            const pagesSetting = JSON.parse(data);
            if (pagesSetting.storeId !== storeId) {
                localStorage.removeItem('pages-setting');
                return;
            }
            
            let pagesShow = intersection(pagesSetting.setting, items);
            if (pagesShow.length === 0) {
                pagesShow = items;
            }
            
            setItems(pagesShow);
            setPagesHide(difference(items, pagesShow));
        }
    }, [])

    useEffect(() => {
        const pagesSetting = {
            storeId: storeId,
            setting: [...items]
        }
        localStorage.setItem('pages-setting', JSON.stringify(pagesSetting));
    }, [items, storeId])

    const reorder = (list: any, startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const hidePage = (page: any) => {
        if (items.length <= 1) {
            return;
        }

        function isNot(item: string, page: any) {
            return item !== page._id
        }
        setItems(prev => prev.filter(item => isNot(item, page)));
        setPagesHide(prev => [...prev, page._id]);
    }

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }

        setItems(reorder(items, source.index, destination.index));
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction='horizontal'>
                {(provided) => (
                    <div
                        className='pages-draggable'
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {items.map((key, index) => (
                            <Draggable key={key} draggableId={key} index={index}  >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        draggable={true}
                                    >
                                        <BtnPage
                                            key={key}
                                            page={pages[key]}
                                            active={pageActive._id === pages[key]._id}
                                            onClick={handleSelectPage}
                                            hidePage={hidePage}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default Pages;