import React from 'react';
import Table from '@components/table';

const columns = [
  {title: 'title1', dataIndex: 'a', key: 'a', width: 100},
  {title: 'title2', dataIndex: 'b', key: 'b', width: 100},
  {
    title: 'title3', dataIndex: 'c', key: 'c', width: 150, render: (text, record, index) => {
      if (index % 2 === 0) {
        return [<div key={'div1'}>{text}</div>, <div key={'div2'}>{text}</div>]
      } else {
        return text;
      }
    }
  },
  {title: 'title4', dataIndex: 'key', key: 'd', width: 150},
  {title: 'title5', dataIndex: 'c', key: 'e', width: 150},
  {title: 'title6', dataIndex: 'c', key: 'f', width: 150},
  {title: 'title7', dataIndex: 'c', key: 'g', width: 150},
  {title: 'title8', dataIndex: 'c', key: 'h', width: 150},
  {title: 'title9', dataIndex: 'b', key: 'i', width: 150},
  {title: 'title10', dataIndex: 'b', key: 'j', width: 150},
  {title: 'title11', dataIndex: 'b', key: 'k', width: 150},
  {title: 'title12', dataIndex: 'b', key: 'l', width: 100},
];

const data = [];

for (let i = 0; i < 1000; i++) {
  data.push({a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: i + ''})
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.timer = 0;
  }

  componentWillMount() {
    this.timer = (new Date()).getTime();
  }

  componentDidMount() {
    let n = (new Date()).getTime();
    console.log('render time -> ', n - this.timer);
  }

  render() {
    return (
      <div>
        <Table columns={columns}
               data={data}
               useFixedHeader
               bordered
               scroll={{y: 300}}
               getRowHeight={(record, index) => (index % 2 === 0 ? 2 : 1)}
        />
      </div>
    )
  }
}

export default App;
