export function createGuiWindow({

    collapsed,

    onToggleCollapsed

}) {

    const panel =
        document.createElement("details"); // div

    panel.open = !collapsed;

    panel.id =
        "scene-gui";

    panel.style.position =
        "fixed";

    panel.style.top =
        "12px";

    panel.style.right =
        "12px";

    panel.style.left =
        "auto";

    panel.style.zIndex =
        "10";

    panel.style.width =
        "min(330px, calc(100vw - 24px))";

    panel.style.boxSizing =
        "border-box";

    panel.style.maxHeight =
        "calc(100vh - 24px)";

    panel.style.overflow =
        "hidden";

    panel.style.display =
        "block";
    //    "flex";

    panel.style.flexDirection =
        "column";

    panel.style.borderRadius =
        "14px";

    panel.style.background =
        "rgba(12,16,24,0.86)";

    panel.style.backdropFilter =
        "blur(10px)";

    panel.style.boxShadow =
        "0 16px 48px rgba(0,0,0,0.35)";

    const header =
        document.createElement("summary");

    header.style.padding =
        "10px 14px";

    header.style.userSelect =
        "none";

    header.style.background =
        "rgba(0,0,0,0.3)";

    header.style.borderBottom =
        "1px solid rgba(255,255,255,0.1)";

    header.style.fontSize =
        "14px";

    header.style.fontWeight =
        "600";

    header.style.color =
        "#ffffff";

    header.style.display =
        "flex";

    header.style.alignItems =
        "center";

    header.style.justifyContent =
        "space-between";

    const title =
        document.createElement("span");

    title.textContent =
        "Settings";

    const dragHandle =
        document.createElement("span");

    dragHandle.textContent =
        "☰";

    dragHandle.title =
        "Drag window";

    dragHandle.style.cursor =
        "grab";

    dragHandle.style.fontSize =
        "18px";

    dragHandle.style.padding =
        "0 4px";

    dragHandle.style.touchAction =
        "none";

    header.append(
        title,
        dragHandle
    );

    panel.append(
        header
    );

    header.addEventListener(
        "click",
        () => {
            requestAnimationFrame(
                () => onToggleCollapsed?.(!panel.open)
            );
        }
    );

    const contentWrapper =
        document.createElement("div");

    contentWrapper.className =
        "gui-content";

    contentWrapper.style.overflowY =
        "auto";

    contentWrapper.style.overflowX =
        "hidden";

    contentWrapper.style.maxHeight =
        "calc(100vh - 80px)";

    contentWrapper.style.webkitOverflowScrolling =
        "touch";
    
    contentWrapper.style.touchAction =
        "pan-y";
        
    // contentWrapper.style.overflow =
    //     "auto";

    // contentWrapper.style.webkitOverflowScrolling =
    //     "touch";

    // contentWrapper.style.maxHeight = "calc(100vh - 80px)";

    // function updateContentHeight() {

    //     const headerHeight =
    //         header.offsetHeight;

    //     contentWrapper.style.height =
    //         `${window.innerHeight - headerHeight - 24}px`;

    //     contentWrapper.style.maxHeight =
    //         `${window.innerHeight - headerHeight - 24}px`;
    // }

    // function updateContentHeight() {

    //     const headerHeight = header.offsetHeight;

    //     const h =
    //         window.innerHeight -
    //         headerHeight -
    //         24;

    //     contentWrapper.style.height = `${h}px`;
    // }

    // function updateContentHeight() {

        // const panelHeight =
        //     panel.getBoundingClientRect().height;

        // const headerHeight =
        //     header.offsetHeight;

        // const h =
        //     panelHeight -
        //     headerHeight;

        // contentWrapper.style.height =
        //     `${Math.max(0, h)}px`;
    // }

    // updateContentHeight();

    panel.append(
        contentWrapper
    );

    const root =
        document.createElement("div");

    root.style.padding =
        "14px";

    root.style.display =
        "grid";

    root.style.gap =
        "12px";

    contentWrapper.append(
        root
    );

    let isDragging = false;
    let moved = false;

    let dragOffsetX =
        0;

    let dragOffsetY =
        0;

    // header.style.touchAction =
    //     "none";

    dragHandle.addEventListener(
        "pointerdown",
        e => {
            moved = false;

            isDragging =
                true;

            const rect =
                panel.getBoundingClientRect();

            panel.style.left =
                `${rect.left}px`;

            panel.style.top =
                `${rect.top}px`;

            panel.style.right =
                "auto";

            dragOffsetX =
                e.clientX -
                rect.left;

            dragOffsetY =
                e.clientY -
                rect.top;

            dragHandle.style.cursor =
                "grabbing";

            dragHandle.setPointerCapture(
                e.pointerId
            );
        }
    );

    dragHandle.addEventListener(
        "pointermove",
        e => {

            if (!isDragging)
                return;

            moved = true;

            panel.style.left =
                `${e.clientX - dragOffsetX}px`;

            panel.style.top =
                `${e.clientY - dragOffsetY}px`;

            keepPanelOnScreen();
        }
    );

    function stopDragging(e) {

        if (!isDragging)
            return;

        isDragging =
            false;

        keepPanelOnScreen();

        dragHandle.style.cursor =
            "grab";

        try {

            dragHandle.releasePointerCapture(
                e.pointerId
            );

        } catch (_) {}
    }

    dragHandle.addEventListener(
        "pointerup",
        stopDragging
    );

    dragHandle.addEventListener(
        "pointercancel",
        stopDragging
    );

    dragHandle.addEventListener(
        "click",
        e => {

            if (!moved)
                return;

            e.preventDefault();
            e.stopPropagation();
        }
    );

    // function keepPanelOnScreen() {

    //     const panelRect =
    //         panel.getBoundingClientRect();

    //     const handleRect =
    //         dragHandle.getBoundingClientRect();

    //     let left =
    //         panelRect.left;

    //     let top =
    //         panelRect.top;

    //     const handleMargin =
    //         8;

    //     //
    //     // Keep drag handle visible horizontally
    //     //
    //     if (
    //         handleRect.right >
    //         window.innerWidth - handleMargin
    //     ) {

    //         left -=
    //             handleRect.right -
    //             (window.innerWidth - handleMargin);
    //     }

    //     if (
    //         handleRect.left <
    //         handleMargin
    //     ) {

    //         left +=
    //             handleMargin -
    //             handleRect.left;
    //     }

    //     //
    //     // Keep header visible vertically
    //     //
    //     const headerHeight =
    //         header.offsetHeight;

    //     top = Math.max(
    //         0,
    //         Math.min(
    //             top,
    //             window.innerHeight -
    //             headerHeight
    //         )
    //     );

    //     panel.style.left =
    //         `${left}px`;

    //     panel.style.top =
    //         `${top}px`;

    //     panel.style.right =
    //         "auto";
    // }

    function keepPanelOnScreen() {

        const rect =
            panel.getBoundingClientRect();

        let left =
            rect.left;

        let top =
            rect.top;

        left = Math.max(
            0,
            Math.min(
                left,
                window.innerWidth -
                rect.width
            )
        );

        top = Math.max(
            0,
            Math.min(
                top,
                window.innerHeight -
                header.offsetHeight
            )
        );

        panel.style.left =
            `${left}px`;

        panel.style.top =
            `${top}px`;

        panel.style.right =
            "auto";
    }

    window.addEventListener(
        "resize",
        keepPanelOnScreen
    );

    return {

        panel,

        root,

        contentWrapper
    };
}