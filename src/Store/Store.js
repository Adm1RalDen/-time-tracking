import { observable, action, decorate } from 'mobx';

class Store {

}
decorate(Store, {
});

const store = new Store();

export default store;
export { Store };