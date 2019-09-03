
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import '../Style/Content.css';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import { Layout } from 'antd';

const EditableContext = React.createContext();

function EditableCell(props) {
  let getInput = () => {
    if (props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  let renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = props;
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
            })(getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };
  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

const EditableTable = inject('Store')(observer(function (props) {
  const { data, setData, editingKey, setEditingKey, counts, setCounts } = props.Store;
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '15%',
      editable: false,
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
        // const { editingKey } = this.state;
        const editable = isEditing(record);
        return editable ? (
          <span className='icon-div'>
            <EditableContext.Consumer>
              {form => (
                <a
                  onClick={() => save(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record.key)}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <div className="icon-div">
              <a disabled={editingKey !== ''} >
                <Popconfirm
                  title=" Sure delete this task?"
                  onConfirm={() => deleteItem(record.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" className='icon' />
                </Popconfirm>
              </a>

              <a disabled={editingKey !== ''} onClick={() => edit(record.key)}>
                <Icon type="edit" className='icon' />
              </a>
            </div>

          );
      },
    },
  ];

  let isEditing = record => record.key === editingKey;

  let getTimes = () => {
    let today = new Date();
    return (('0' + today.getDate()).slice(-2) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear()
      + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());

  }

  let cancel = () => {
    setEditingKey('');
  }

  let deleteItem = (key) => {
    let dataSourse = [...data];
    setData(dataSourse.filter(item => item.key !== key));
  }

  let save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        item.date = getTimes();
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
        // this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
        // this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  let edit = (key) => {
    setEditingKey(key);
  }

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const columnsMap = columns.map(col => {
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
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Layout.Content className='content'>
      <EditableContext.Provider value={props.form}>
        <Table
          components={components}
          bordered
          dataSource={data}
          columns={columnsMap}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 7
          }}
        />
      </EditableContext.Provider>
    </Layout.Content>

  );
}
));

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable
