import React from 'react';
import Table from 'fast-table';
import './style.css';

const columns = [
  {
    title: 'title4',
    align: 'left',
    dataIndex: 'key',
    key: 'd',
    width: '20%',
    bodyStyle: {background: '#121A18', color: '#F9C152'}
  },
  {
    title: 'title1',
    align: 'left',
    dataIndex: 'a',
    key: 'a',
    width: '20%',
    bodyStyle: {background: '#1E1F17', color: '#FF9200'}
  },
  {
    title: 'title2',
    align: 'left',
    dataIndex: 'b',
    key: 'b',
    width: '30%',
    bodyStyle: {background: '#122024', color: '#11A1FF'}
  },
  {
    title: 'title5',
    align: 'left',
    dataIndex: 'c',
    key: 'e',
    width: '10%',
    bodyStyle: {background: '#121A18', color: '#F9C152'}
  },
  {title: 'title6', align: 'left', dataIndex: 'd', key: 'f', bodyStyle: {background: '#121A18', color: '#7B8280'}},
];

const data = [];

for (let i = 0; i < 2000; i++) {
  data.push({a: '4.88', b: '1000', c: '200', d: '17:20:03', key: i + ''})
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
        <Table
          columns={columns}
          dataSource={data}
          fixedHeader
          bordered
          width='90%'
          height='90%'
        />
      </div>
    )
  }
}

export default App;
