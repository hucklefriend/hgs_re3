
import {MainNetwork} from "./hgn/main-network.js";

window.onload = function() {
    let network = new MainNetwork();
    network.start();
}
