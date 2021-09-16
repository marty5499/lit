import { __decorate } from "tslib";
import { customElement } from 'lit-element';
import { TabBarBase } from '@material/mwc-tab-bar/mwc-tab-bar-base';
import { styles } from '@material/mwc-tab-bar/mwc-tab-bar.css';
let TabBar = class TabBar extends TabBarBase {
    constructor(){
        super();
        this.addEventListener('MDCTabBar:activated', function (evt) {
            var contentEls = document.querySelectorAll('.tab-container');
            var activeCnt = document.querySelector('.tab-container-active');
            if(null!=activeCnt) activeCnt.classList.remove('tab-container-active');
            contentEls[evt.detail.index].classList.add('tab-container-active');
        })        
    }
};
TabBar.styles = [styles];
TabBar = __decorate([customElement('mwc-tab-bar')], TabBar);
export { TabBar };