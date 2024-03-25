import {Network} from "./hgn/network.js";

window.onload = function() {
    const network = Network.getInstance();
    network.start();
}
