import Hover from "hover";
import $ from "mori";

//Actions that will mutate the app state
const actions = {
    fetchSN: db => $.assoc(db, "sportler", $.vector("Tim", "Thomas", "Franz")),
    // inc: state => $.assoc(state, "hallo", "tschau"),
};

//Initial state as an immutable datastructure
const initialState = $.hashMap();

export default new Hover(actions, initialState);
