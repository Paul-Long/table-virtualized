import React from 'react';
import Table from 'fast-table';
import './style.css';

const columns = [
  {
    title: '第一列',
    align: 'left',
    dataIndex: 'key',
    sortEnable: true,
    order: true,
    width: 400,
    bodyStyle: {background: '#121A18', color: '#F9C152'}
  },
  {
    title: '第二列',
    dataIndex: 'key0',
    width: 400,
    sortEnable: true,
    bodyStyle: {background: '#1E1F17', color: '#FF9200'},
    // children: [
    //   {
    //     title: 'title11', dataIndex: 'a1', width: '100', children: [
    //       {title: 'title111', align: 'left', dataIndex: 'a11', width: '5%'},
    //       {title: 'title112', align: 'right', dataIndex: 'a12', width: '5%'}
    //     ]
    //   },
    //   {
    //     title: 'title12', dataIndex: 'a2', width: '10%', children: [
    //       {title: 'title121', align: 'left', dataIndex: 'a21', width: '5%'},
    //       {title: 'title122', align: 'right', dataIndex: 'a22', width: '5%'}
    //     ]
    //   }
    // ]
  },
  {
    title: '第三列',
    dataIndex: 'key1',
    width: 400,
    bodyStyle: {background: '#122024', color: '#11A1FF'},
    // children: [
    //   {
    //     title: 'title21', align: 'left', dataIndex: 'b1', width: '15%'
    //   },
    //   {
    //     title: 'title22', align: 'right', dataIndex: 'b2', width: '15%'
    //   }
    // ]
  },
  {
    title: '第四列',
    align: 'left',
    dataIndex: 'key2',
    width: 400,
    bodyStyle: {background: '#121A18', color: '#F9C152'}
  },
  {
    title: '第五列',
    align: 'left',
    dataIndex: 'key3',
    width: 400,
    bodyStyle: {background: '#121A18', color: '#7B8280'}
  },
];

const data = [];

for (let i = 0; i < 10000; i++) {
  const row = {key: `${i}`};
  for (let j = 0; j < 10; j++) {
    row[`key${j}`] = Math.random().toString(36).substr(2);
  }
  data.push(row);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.timer = 0;
  }

  state = {
    data: data
  };

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
          dataSource={this.state.data}
          fixedHeader
          showHeader
          bordered
          width={'calc(100% - 10px)'}
          height={'calc(100% - 10px)'}
          footer={() => '加载更多'}
          sortMulti={false}
          onSort={(column, order) => {
            // console.log(order);
            const data = this.state.data;
            this.setState({data: [...data].reverse()});
          }}
          onScrollEnd={() => {
            console.log('onScrollEnd refresh');
          }}
        />
      </div>
    )
  }
}

export default App;
