// ui.ts
// export function createSlider(parent, label, min, max, step, value, onChange, render, displayTransform) {
//     const wrapper = document.createElement("div");
//     wrapper.style.display = "flex";
//     wrapper.style.alignItems = "center";
//     wrapper.style.gap = "6px";
//     wrapper.style.font = "12px sans-serif";
//     wrapper.style.color = "#e8eef7";
//     const title = document.createElement("span");
//     title.textContent = label;
//     title.style.minWidth = "40px";
//     const range = document.createElement("input");
//     range.type = "range";
//     range.min = String(min);
//     range.max = String(max);
//     range.step = String(step);
//     range.value = String(value);
//     range.style.flex = "0 0 60px";
//     const number = document.createElement("input");
//     number.type = "number";
//     number.style.flex = "0 0 60px";
//     // width = "80px";
//     const transform = displayTransform ?? {
//         toDisplay: value => String(value),
//         fromDisplay: value => value
//     };
//     const displayStep = transform.displayStep ?? step;
//     number.min = transform.toDisplay(min);
//     number.max = transform.toDisplay(max);
//     number.step = String(displayStep);
//     number.value = transform.toDisplay(value);
//     function update(v) {
//         const nextValue = Math.min(max, Math.max(min, v));
//         range.value = String(nextValue);
//         number.value = transform.toDisplay(nextValue);
//         onChange(nextValue);
//         render();
//     }
//     function enforceRangeAndUpdate(v) {
//         update(v);
//     }
//     range.addEventListener("input", () => enforceRangeAndUpdate(Number(range.value)));
//     number.addEventListener("change", () => {
//         const rawNumber = Number(number.value);
//         if (Number.isFinite(rawNumber)) {
//             update(transform.fromDisplay(rawNumber));
//         }
//     });
//     wrapper.append(title, range, number);
//     parent.appendChild(wrapper);
// }

export function createSlider(
    parent,
    label,
    min,
    max,
    step,
    value,
    onChange,
    render,
    displayTransform,
    onChangeEnd
) {

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "6px";
    wrapper.style.font = "12px sans-serif";
    wrapper.style.color = "#e8eef7";

    const title = document.createElement("span");
    title.textContent = label;
    title.style.minWidth = "40px";

    const range = document.createElement("input");
    range.type = "range";
    range.min = String(min);
    range.max = String(max);
    range.step = String(step);
    range.value = String(value);
    range.style.flex = "0 0 60px";

    const number = document.createElement("input");
    number.type = "number";
    number.style.flex = "0 0 60px";

    const transform = displayTransform ?? {
        toDisplay: value => String(value),
        fromDisplay: value => value
    };

    const displayStep = transform.displayStep ?? step;

    number.min = transform.toDisplay(min);
    number.max = transform.toDisplay(max);
    number.step = String(displayStep);
    number.value = transform.toDisplay(value);

    function setValue(v, notify = false) {

        if (!Number.isFinite(v)) {
            number.value =
                transform.toDisplay(
                    Number(range.value)
                );
            return;
        }

        const nextValue =
            Math.min(max, Math.max(min, v));

        range.value = String(nextValue);
        number.value =
            transform.toDisplay(nextValue);

        if (notify) {
            onChange(nextValue);
            render();
        }
    }

    function finish(v) {

        // console.log("finish", v);

        if (onChangeEnd) {
            onChangeEnd(v);
        }
    }

    function update(v) {
        setValue(v, true);
    }

    range.addEventListener(
        "input",
        () => update(Number(range.value))
    );

    range.addEventListener(
        "pointerup",
        () => finish(Number(range.value))
    );

    range.addEventListener(
        "change",
        () => finish(Number(range.value))
    );

    number.addEventListener(
        "change",
        () => {

            const rawNumber =
                Number(number.value);

            if (Number.isFinite(rawNumber)) {

                const value =
                    transform.fromDisplay(
                        rawNumber
                    );

                if (Number.isFinite(value)) {
                    update(value);
                    finish(value);
                } else {
                    setValue(Number(range.value));
                }
            } else {
                setValue(Number(range.value));
            }
        }
    );

    wrapper.append(
        title,
        range,
        number
    );

    parent.appendChild(wrapper);

    return {
        wrapper,
        range,
        number,

        setValue,

        getValue() {
            return Number(range.value);
        }
    };
}

export function createButton(parent, label, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.padding = "0.45rem 0.65rem";
    button.style.borderRadius = "8px";
    button.style.border = "1px solid rgba(255,255,255,0.16)";
    button.style.background = "rgba(255,255,255,0.08)";
    button.style.color = "#fff";
    button.onclick = onClick;
    parent.appendChild(button);
}
export function createSmallButton(parent, label, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.padding = "0.1rem 0.1rem";
    button.style.borderRadius = "1px";
    button.style.border = "1px solid rgba(255,255,255,0.16)";
    button.style.background = "rgba(255,255,255,0.08)";
    button.style.color = "#fff";
    button.onclick = onClick;
    parent.appendChild(button);
}
export function createSelect(parent, label, options, value, onChange, render, rebuild) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.gap = "6px";
    wrapper.style.alignItems = "center";
    wrapper.style.color = "#e8eef7";
    wrapper.style.font = "12px sans-serif";
    const title = document.createElement("span");
    title.textContent = label;
    title.style.minWidth = "80px";
    const select = document.createElement("select");
    select.style.flex = "1";
    for (const opt of options) {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        if (opt.value === value)
            o.selected = true;
        select.appendChild(o);
    }
    select.addEventListener("change", () => {
        onChange(select.value);
        render();
        rebuild();
    });
    wrapper.append(title, select);
    parent.appendChild(wrapper);
}
export function createNewObjectSelect(parent, label, defaultText, options, value, onChange, render, rebuild) {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.gap = "6px";
    wrapper.style.alignItems = "center";
    wrapper.style.color = "#e8eef7";
    wrapper.style.font = "12px sans-serif";
    const title = document.createElement("span");
    title.textContent = label;
    title.style.minWidth = "80px";
    const select = document.createElement("select");
    select.style.flex = "1";
    // Default option
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = defaultText;
    placeholder.selected = true;
    placeholder.disabled = false;
    select.appendChild(placeholder);
    // Real options
    for (const opt of options) {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        // optional: preselect if needed
        if (value && opt.value === value) {
            o.selected = true;
        }
        select.appendChild(o);
    }
    select.addEventListener("change", () => {
        const selected = select.value;
        // ignore default
        if (!selected)
            return;
        onChange(selected);
        render();
        rebuild?.();
        // reset back to default
        select.value = "";
    });
    wrapper.append(title, select);
    parent.appendChild(wrapper);
}
export function createSwitch(parent, label, value, onChange, render, rebuild) {
    const wrapper = document.createElement("label");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.alignItems = "center";
    wrapper.style.font = "12px sans-serif";
    wrapper.style.color = "#e8eef7";
    const title = document.createElement("span");
    title.textContent = label;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = value;
    input.addEventListener("change", () => {
        onChange(input.checked);
        render?.();
        rebuild?.();
    });
    wrapper.append(title, input);
    parent.appendChild(wrapper);
}
export function createSection(parent, title, open = true) {
    const section = document.createElement("details");
    section.open = open;
    section.style.border = "1px solid rgba(255,255,255,0.12)";
    section.style.borderRadius = "10px";
    section.style.padding = "8px 10px";
    section.style.margin = "4px 0";
    section.style.background = "rgba(255,255,255,0.04)";
    const summary = document.createElement("summary");
    summary.textContent = title;
    summary.style.cursor = "pointer";
    summary.style.font = "600 12px/1.3 sans-serif";
    summary.style.color = "#ffffff";
    summary.style.listStyle = "none";
    const content = document.createElement("div");
    content.style.display = "grid";
    content.style.gap = "8px";
    content.style.marginTop = "10px";
    section.append(summary, content);
    parent.appendChild(section);
    return content;
}
