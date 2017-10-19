import Hover from "hover";
import $ from "mori";

//Actions that will mutate the app state
const actions = {
    toggleHonkey: db => $.assoc(db, "showHonkey", !$.get(db, "showHonkey", false)),
    tower: db => $.assoc(db, "tower", "...and the gunslinger followed."),
};

//Initial state as an immutable datastructure
const initialState = $.hashMap("tower", "The man in black fled across the desert, ...");

export default new Hover(actions, initialState);
