import { observable, action, decorate } from 'mobx';

class Store {
    data = [];
    editingKey = '';
    counts = 0;

    setData = (props) => {
        this.data = props;
    }
    setEditingKey = (props) => {
        this.editingKey = props;
    }
    setCounts = (props) => {
        this.counts = props;
    }
}
decorate(Store, {
    setData: action,
    setCounts: action,
    setEditingKey: action,
    data: observable,
    editingKey: observable,
    counts: observable,
});

const store = new Store();

export default store;
export { Store };