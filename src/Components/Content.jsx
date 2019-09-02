
import React from 'react';
import 'antd/dist/antd.css';
import '../Style/Content.css';
import { Table, Input, InputNumber, Popconfirm, Form , Button} from 'antd';

const data = [];
let today = new Date();
// for (let i = 0; i < 5; i++) {
//   data.push({
//     key: i.toString(),
//     date: ('0' + today.getDate()).slice(-2)  + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear(),
//     message: '',
//     futurePlan: '',
//     workHours: 0
//   });
// }
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '', counts : 0  };
    this.columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        width: '15%',
        editable: true,
      },
      {
        title: 'Message',
        dataIndex: 'message',
        width: '25%',
        editable: true,
      },
      {
        title: 'Future plan',
        dataIndex: 'futurePlan',
        width: '40%',
        editable: true,
      },
      {
        title: 'Worked hours',
        dataIndex: 'workHours',
        width: '10%',
        editable: true,
      },
      {
        title: 'Delete / Edit',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
              <div>
                  <a disabled={editingKey !== ''} onClick={() => {this.delete(record.key); console.log(record.key)}}>
                Delete
                </a>
                /
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                Edit
                </a>
              </div>
            
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  delete = (key) =>{
    let dataSourse = [...this.state.data];
    this.setState({data: dataSourse.filter(item => item.key !== key)});
  }

  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }
  add = () => {
    const {counts, data} = this.state;
    console.log("срабатываю", counts, data)

    let newData = {
        key: counts.toString(),
        date: ('0' + today.getDate()).slice(-2)  + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear(),
        message: '',
        futurePlan: '',
        workHours: 0
    };
    this.setState({data: [...data, newData], counts: counts + 1})
  }
  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
        <Button type = 'primary' onClick = {this.add}>Add</Button>
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable
          