import { expect, test, vi } from "vitest";
import useStore from "./store";
import { useEffect } from "react";
import { render } from "@testing-library/react";

function TestComponent({selector, effect}) {
    const items = useStore(selector);

    useEffect(() => {
        effect(items);
    }, [items]);

    return null;
};

test("Should return default value at he start", () => {
    const selector = (store) => store.tasks;
    const effect = vi.fn();
    render(<TestComponent selector={selector} effect={effect} />)
    expect(effect).toBeCalledWith([]);
});

test("Should add an item through the store and rerun an effect", () => {
    const selector = (store) => ({tasks: store.tasks, addTask: store.addTask});
    const effect = vi.fn().mockImplementation((items) => {
        if (items.tasks.length === 0) {
            items.addTask('a', 'b')
        }
    });
    render(<TestComponent selector={selector} effect={effect} />)
    expect(effect).toHaveBeenCalledTimes(2);
    // expect(effect).toBeCalledWith([]);
});