import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import "./index.css";
import { Table, Input, Button, Space, Form } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import React, {
  useState,
  useRef,
  useContext,
  createContext,
  useEffect,
} from "react";

const EditableContext = createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  // console.log(children);

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          outline: "none",
          border: "none",
        }}
        name={dataIndex}
        // rules={[
        //   {
        //     required: true,
        //     message: `${title} is required.`,
        //   },
        // ]}
      >
        <Input
          className="custom-input-field"
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          padding: 5,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const cols = [
  "brandLinks",
  "ytStory",
  "ytVideo",
  "igStatic",
  "igVideo",
  "igtv",
  "igReel",
];
let temp = [];
for (let i = 0; i < 100; i++) {
  temp.push({
    key: i,
    name: "John Brown " + i,
    age: i + 1,
    igStaticLink: "-",
    street: "Lake Park",
    igtv: "IGTV",
    igStory: "IGTV",
    building: "C",
    selected: i === 2 || i === 4 || i === 6,
    number: 2035 + i,
    companyAddress: "Lake Street 42",
    companyName: "SoftLake Co",
    gender: "M",
  });
}

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [selectedRowsDefault, setSelectedRowsDefault] = useState([]);

  const [igStatic, setIgStatic] = useState(false);
  const [igVideo, setIgVideo] = useState(false);
  const [igtv, setIgtv] = useState(false);
  const [igReels, setIgReels] = useState(false);
  const [ytStory, setYtStory] = useState(false);
  const [ytVideo, setYtVideo] = useState(false);

  const [isInstaPresent, setIsInstaPresent] = useState(false);

  const [filteredColumns, setFilteredColumns] = useState([]);

  useEffect(() => {
    setData(temp);
    let tem = [];
    temp.forEach((item) => {
      if (item.selected) {
        tem.push(item.key);
      }
      setSelectedRowsDefault(tem);
    });
    // let selectedItems = [];
    // tem.forEach((item) => {
    //   selectedItems.push(temp[item]);
    // });
    // const filteredSelected = data.filter(
    //   (item) => !selectedItems.includes(item)
    // );
    // // setData(...tem, ...filteredSelected);
    // console.log({ tem, filteredSelected });
    cols.forEach((item) => {
      switch (item) {
        case "ytStory":
          setYtStory(true);
          break;
        case "ytVideo":
          setYtVideo(true);
          break;
        case "igStatic":
          setIgStatic(true);
          setIsInstaPresent(true);
          break;
        case "igVideo":
          setIgVideo(true);
          setIsInstaPresent(true);
          break;
        case "igtv":
          setIgtv(true);
          setIsInstaPresent(true);
          break;
        case "igReel":
          setIgReels(true);
          setIsInstaPresent(true);
          break;
        default:
          break;
      }
    });
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // useEffect(() => {

  // }, []);

  const searchInput = useRef(null);

  const rowSelection = {
    selectedRowKeys: selectedRowsDefault,
    // selectedRows: selectedRowsDefault,
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      console.log("Selected Row");
      setSelectedRowsDefault(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          // ref={(node) => {
          //   searchInput = node;
          // }}
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex]) {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      // record[dataIndex]
      //   ? record[dataIndex]
      //       .toString()
      //       .toLowerCase()
      //       .includes(value.toLowerCase())
      //   : "";
      setData(record[dataIndex]);
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setState({
    //   searchText: selectedKeys[0],
    //   searchedColumn: dataIndex,
    // });
    setSearchText(selectedKeys[0]);
    console.log(selectedKeys, dataIndex);
    setSearchedColumn(dataIndex);
  };

  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setData(newData);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const columnData = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      ...getColumnSearchProps("name"),
      fixed: "left",
      className: "name-header",
      // sorter: (a, b) => a.key - b.key,
      // filters: [
      //   {
      //     text: "Joe",
      //     value: "Joe",
      //   },
      //   {
      //     text: "John",
      //     value: "John",
      //   },
      // ],
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: "Brand Details",
      className: "brand-details-header",
      filters: [
        {
          text: "Selected Influencers",
          value: "selected",
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => {
        // console.log({
        //   record,
        //   something:
        //     record.key ===
        //     selectedRowsDefault[selectedRowsDefault.indexOf(record.key)],
        // });
        return (
          record.key ===
          selectedRowsDefault[selectedRowsDefault.indexOf(record.key)]
        );
      },
      children: [
        {
          title: "Brand Link",
          dataIndex: "street",
          key: "street",
          className: "brand-link-header",
          editable: true,
          width: 100,
          // sorter: (a, b) => a.age - b.age,
          render: (link) => <p className="single-line-text">{link}</p>,
        },
        {
          title: "Brand Clicks",
          dataIndex: "number",
          className: "brand-clicks-header",
          key: "brandClick",
          width: 120,
          render: (text) => (
            <div>
              <p className="single-line-text">{text}</p>
            </div>
          ),
          // sorter: (a, b) => a.age - b.age,
        },
      ],
    },
    {
      title: "Analysis",
      key: "analysis",
      className: "analysis-header main-analysis-header",
      children: [
        {
          title: "YT Story",
          key: "ytStoryAnalysis",
          hidden: !ytStory,
          className: "analysis-header yt-story-header",
          children: [
            {
              title: "Link",
              dataIndex: "ytStoryLinkAnalysis",
              key: "ytStoryLinkAnalysis",
              hidden: !ytStory,
              editable: true,
              width: 100,
              className: "analysis-inner-header inner-header-left",
              render: (link) => <p className="single-line-text">{link}</p>,
            },
            {
              title: "Likes",
              dataIndex: "ytStoryLikesAnalysis",
              key: "ytStoryLikesAnalysis",
              hidden: !ytStory,
              width: 80,
              className: "analysis-inner-header inner-header-center",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
            {
              title: "Comments",
              dataIndex: "ytStoryCommentsAnalysis",
              key: "ytStoryCommentsAnalysis",
              hidden: !ytStory,
              width: 120,
              className: "analysis-inner-header inner-header-right",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
          ],
        },
        {
          title: "YT Video",
          key: "ytVideoAnalysis",
          hidden: !ytVideo,
          className: "analysis-header yt-story-header",
          children: [
            {
              title: "Link",
              dataIndex: "ytVideoLinkAnalysis",
              key: "ytVideoLinkAnalysis",
              // hidden: !ytVideo,
              editable: true,
              width: 100,
              className: "analysis-inner-header inner-header-left",
              render: (link) => <p className="single-line-text">{link}</p>,
            },
            {
              title: "Likes",
              dataIndex: "ytVideoLikesAnalysis",
              key: "ytVideoLikesAnalysis",
              // hidden: !ytVideo,
              width: 80,
              className: "analysis-inner-header inner-header-center",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
            {
              title: "Comments",
              dataIndex: "ytVideoCommentsAnalysis",
              key: "ytVideoCommentsAnalysis",
              // hidden: !ytVideo,
              width: 120,
              className: "analysis-inner-header inner-header-right",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
          ],
        },
        {
          title: "IG Static",
          // dataIndex: "companyAddress",
          key: "ig static",
          hidden: !igStatic,
          className: "analysis-header ig-static-header",
          children: [
            {
              title: "Link",
              dataIndex: "igStaticLinkAnalysis",
              key: "igStaticLinkAnalysis",
              // hidden: !igStatic,
              editable: true,
              width: 100,
              className: "analysis-inner-header inner-header-left",
              render: (link) => <p className="single-line-text">{link}</p>,
            },
            {
              title: "Likes",
              dataIndex: "number",
              key: "igStaticLikes",
              // hidden: !igStatic,
              width: 80,
              className: "analysis-inner-header inner-header-center",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
            {
              title: "Comments",
              dataIndex: "igStaticComments",
              key: "igStaticComments",
              // hidden: !igStatic,
              width: 120,
              className: "analysis-inner-header inner-header-right",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
          ],
        },
        {
          title: "IG Video",
          key: "ig video",
          hidden: !igVideo,
          className: "analysis-header ig-video-header",
          children: [
            {
              title: "Link",
              dataIndex: "igVideoLink",
              key: "igVideoLinkAnalysis",
              // hidden: !igVideo,
              editable: true,
              width: 100,
              className: "analysis-inner-header inner-header-left",
              render: (link) => <p className="single-line-text">{link}</p>,
            },
            {
              title: "Likes",
              dataIndex: "number",
              key: "igStaticLikesAnalysis",
              // hidden: !igVideo,
              width: 80,
              className: "analysis-inner-header inner-header-center",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
            {
              title: "Comments",
              dataIndex: "igVideoCommentsAnalysis",
              key: "igVideoCommentsAnalysis",
              // hidden: !igVideo,
              width: 120,
              className: "analysis-inner-header inner-header-right",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
          ],
        },
        {
          title: "IGTV",
          dataIndex: "companyName",
          key: "igtvAnalysis",
          hidden: !igtv,
          className: "analysis-header igtv-header",
          children: [
            {
              title: "Link",
              dataIndex: "igStaticLink",
              key: "igtvLinkAnalysis",
              // hidden: !igtv,
              editable: true,
              width: 100,
              className: "analysis-inner-header inner-header-left",
              render: (link) => <p className="single-line-text">{link}</p>,
            },
            {
              title: "Likes",
              dataIndex: "number",
              key: "igtvLikesAnalysis",
              // hidden: !igtv,
              width: 80,
              className: "analysis-inner-header inner-header-center",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
            {
              title: "Comments",
              dataIndex: "igtvCommentsAnalysis",
              key: "igtvCommentsAnalysis",
              // hidden: !igtv,
              width: 120,
              className: "analysis-inner-header inner-header-right",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
          ],
        },
        {
          title: "IG Reels",
          key: "ig reels",
          hidden: !igReels,
          className: "analysis-header ig-reels-header",
          children: [
            {
              title: "Link",
              dataIndex: "igStaticLinkAnalysis",
              key: "igStaticLinkAnalysis",
              // hidden: !igReels,
              editable: true,
              width: 100,
              className: "analysis-inner-header inner-header-left",
              render: (link) => <p className="single-line-text">{link}</p>,
            },
            {
              title: "Likes",
              dataIndex: "number",
              key: "igStaticLikesAnalysis",
              // hidden: !igReels,
              width: 80,
              className: "analysis-inner-header inner-header-center",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
            {
              title: "Comments",
              dataIndex: "igStaticCommentsAnalysis",
              key: "igStaticCommentsAnalysis",
              // hidden: !igReels,
              width: 120,
              className:
                "analysis-inner-header inner-header-right ig-reels-comments",
              render: (text) => (
                <div>
                  <p className="single-line-text">{text}</p>
                </div>
              ),
            },
          ],
        },
      ],
    },
  ];

  //Formatted Data and Cell Editing

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // const colsWithoutIgStatic = columnData.filter((col) => col.dataIndex !== 'igStatic');

  // const colsWithoutIgStatic = columnData.filter((col) => col.dataIndex !== 'igStatic');

  // const colsWithoutIgStatic = columnData.filter((col) => col.dataIndex !== 'igStatic');

  // const colsWithoutIgStatic = columnData.filter((col) => col.dataIndex !== 'igStatic');

  // const filteredColumns = columnData.filter((col) => {
  //   if (col.children && col.children.length) {
  //     let tempItem = col.children.filter((item) => item.hidden !== true);
  //     console.log({ tempItem });
  //     console.log("Inside")
  //     return tempItem;
  //   }
  //   console.log("Outside")
  //   return col.hidden !== true;
  // });

  // console.log(filteredColumns);

  // useEffect(() => {

  // }, [cols]);

  // console.log(filterColumns());

  // const filteredColumns = columnData.filter((col) => {
  //   // if (col.children) return col.children.some((item) => item.hidden === false);
  //   // else return col;

  //   if (col.children)
  //     console.log({
  //       children: col.children,
  //       something: col.children.filter((item) => item.hidden === false),
  //     });
  //   return col.children
  //     ? col.children.filter((item) => item.hidden === false)
  //     : col;
  // });

  // const filteredColumns = filterColumns();

  // console.log(filteredColumns);

  const filterColumns = () => {
    let total = columnData;
    let temp = [];
    let tempCol = {};
    columnData.forEach((col) => {
      if (col.children) {
        tempCol = col;
        temp = col.children.filter((item) => item.hidden === false);
      }
    });
    total[columnData.indexOf(tempCol)] = { ...tempCol, children: temp };
    return total;
  };

  // setFilteredColumns(filterColumns());

  const columns = filterColumns().map((col) => {
    let temp = [];
    let innerChildren = [];
    if (!col.editable) {
      // console.log(col);
      if (col.children) {
        temp = col.children;
        col.children.forEach((child) => {
          if (child.children) {
            //For Inner Children inside analysis > IG > Children
            innerChildren = child.children;

            child.children.forEach((innerChild) => {
              if (innerChild.editable) {
                // innerChildren.push({
                //   ...innerChild,
                //   onCell: (record) => ({
                //     record,
                //     editable: innerChild.editable,
                //     dataIndex: innerChild.dataIndex,
                //     title: innerChild.title,
                //     handleSave: handleSave,
                //   }),
                // });
                innerChildren[innerChildren.indexOf(innerChild)] = {
                  ...innerChild,
                  onCell: (record) => ({
                    record,
                    editable: innerChild.editable,
                    dataIndex: innerChild.dataIndex,
                    title: innerChild.title,
                    handleSave: handleSave,
                  }),
                };
              }
            });
          }
          if (child.editable) {
            // temp.push({
            //   ...child,
            //   children: innerChildren,
            //   onCell: (record) => ({
            //     record,
            //     editable: child.editable,
            //     dataIndex: child.dataIndex,
            //     title: child.title,
            //     handleSave: handleSave,
            //   }),
            // });
            temp[temp.indexOf(child)] = {
              ...child,
              children: innerChildren,
              onCell: (record) => ({
                record,
                editable: child.editable,
                dataIndex: child.dataIndex,
                title: child.title,
                handleSave: handleSave,
              }),
            };
          }
        });

        return {
          ...col,
          children: temp,
        };
      }
      return col;
    }
    console.log(col);
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              // if (!record.selected) {
              //   setSelectedRowsDefault([...selectedRowsDefault, rowIndex]);
              // }
              // console.log({ record, rowIndex });
            },
          };
        }}
        loading={loading}
        className="data-table"
        components={components}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "editable-row dark-cell" : "editable-row light-cell"
        }
        columns={columns}
        dataSource={data}
        // bordered
        size="middle"
        scroll={{ x: "calc(700px + 50%)", y: "70vh" }}
      />
    </>
  );
};

export default App;
