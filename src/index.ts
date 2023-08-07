import { Fiber, render } from "./render";

export {
    render
}

const root = document.getElementById("root");



const fiberTree: Fiber = {
    type: "div",
    props: {
        id: "box"
    },
    children: [
        {
            type: "span",
            props: {
                id: "box_span"
            },
            children: "hi there"
        },
        {
            type: "ul",
            props: {
                id: "box_ul"
            },
            children: [
                {
                    type: "li",
                    props: {
                        id: "box_ul_li_1"
                    },
                    children: "i am one list"
                },
                {
                    type: "li",
                    props: {
                        id: "box_ul_li_2"
                    },
                    children: "i am two lists"
                }
            ]
        },
        {
            type: "h1",
            props: {
                id: "box_h1"
            },
            children: "a header"
        }
    ]
}

const fiberTree2: Fiber = {
    type: "div",
    props: {
        id: "box"
    },
    children: [
    
        {
            type: "ul",
            props: {
                id: "box_ul"
            },
            children: [

                {
                    type: "li",
                    props: {
                        id: "box_ul_li_2"
                    },
                    children: "i am two lists"
                }
            ]
        },
        {
            type: "h1",
            props: {
                id: "box_h1"
            },
            children: "a header"
        },
        {
            type: "h2",
            children: "a second header"
        }
    ]
}

render(fiberTree, root);

// setTimeout(() => {

//     render(null, root);
// }, 3000);

setTimeout(() => {

    render(fiberTree2, root);
}, 1000);
