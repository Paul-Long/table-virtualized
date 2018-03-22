import React from 'react';
import Table from '@components/table';
import './style.less';

const columns = [
  {title: 'title4', dataIndex: 'key', key: 'd', width: '20%'},
  {title: 'title1', dataIndex: 'a', key: 'a', width: '20%'},
  {title: 'title2', dataIndex: 'b', key: 'b', width: '30%'},
  {title: 'title5', dataIndex: 'c', key: 'e', width: '10%'},
  {title: 'title6', dataIndex: 'c', key: 'f', width: '20%'},
];

const data = [];

for (let i = 0; i < 1000000; i++) {
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
               dataSource={data}
               fixedHeader
               bordered
        />
      </div>
    )
  }
}

export default App;
