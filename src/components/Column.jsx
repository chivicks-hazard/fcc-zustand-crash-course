import './Column.css';
import useStore from '../store';
import Task from './Task';
import { shallow } from 'zustand/shallow';
import { useMemo, useState } from 'react';
import classNames from 'classnames';

const Column = ({state}) => {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);

    const tasks = useStore(
        (store) => store.tasks,
        shallow
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => task.state === state);
    }, [tasks, state]);

    const addTask = useStore(store => store.addTask);
    const setDraggedTask = useStore(store => store.setDraggedTask);
    const draggedTask = useStore(store => store.draggedTask);
    const moveTask = useStore(store => store.moveTask);

    return (
        <div 
            className={classNames("column", {drop: drop})}
            onDragOver={(e) => {
                setDrop(true);
                e.preventDefault();
            }}
            onDragLeave={(e) => {
                setDrop(false);
                e.preventDefault();
            }}
            onDrop={(e) => {
                setDrop(false);
                console.log(draggedTask);
                moveTask(draggedTask, state)
                setDraggedTask(null);
            }}
        >
            <div className='titleWrapper'>
                <p>{state}</p>
                <button onClick={() => setOpen(true)}>Add</button>
            </div>
            {filteredTasks.map((task) => (
                <Task title={task.title} key={task.title} />
            ))}

            {open && (
                <div className="Modal">
                    <div className="modalContent">
                        <input 
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)} />
                        <button onClick={() => {
                            addTask(text, state);
                            setText('');
                            setOpen()
                        }}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Column