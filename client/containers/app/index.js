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
    fixed: 'left',
    width: 100,
    // bodyStyle: {background: '#121A18', color: '#F9C152'}
  },
  {
    title: '第二列',
    dataIndex: 'key0',
    width: 100,
    sortEnable: true,
    // bodyStyle: {background: '#1E1F17', color: '#FF9200'},
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
    width: 100,
    // bodyStyle: {background: '#122024', color: '#11A1FF'},
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
    width: 100,
    // bodyStyle: {background: '#121A18', color: '#F9C152'}
  },
  {
    title: '第五列',
    align: 'left',
    dataIndex: 'key3',
    width: 100,
    // bodyStyle: {background: '#121A18', color: '#7B8280'}
  },
  {
    title: '第六列',
    align: 'left',
    dataIndex: 'key4',
    width: 100,
  },
  {
    title: '第七列',
    align: 'left',
    dataIndex: 'key5',
    width: 100,
  },
  {
    title: '第八列',
    align: 'left',
    dataIndex: 'key6',
    width: 100,
  },
  {
    title: '第九列',
    align: 'left',
    dataIndex: 'key7',
    width: 100,
  },
  {
    title: '第十列',
    align: 'left',
    dataIndex: 'key8',
    width: 100,
  },
];

function update() {
  const data = [];

  for (let i = 0; i < 1000; i++) {
    const row = {key: `${i}`};
    for (let j = 0; j < 10; j++) {
      row[`key${j}`] = Math.random().toString(36).substr(2);
    }
    const children = [];
    for (let c = 0; c < 10; c++) {
      const r = {key: `${i}-${c}`};
      for (let j = 0; j < 10; j++) {
        r[`key${j}`] = Math.random().toString(36).substr(2);
      }
      children.push(r);
    }
    row.children = children;
    data.push(row);
  }
  return data;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.timer = 0;
  }

  state = {
    data: update()
  };

  componentWillMount() {
    this.timer = (new Date()).getTime();
  }

  componentDidMount() {
    let n = (new Date()).getTime();
    console.log('render time -> ', n - this.timer);
    // setInterval(() => {
    //   this.setState({data: update()});
    // }, 2000);
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
