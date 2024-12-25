import React, {useEffect} from "react";
import {Helmet} from "react-helmet";
import {Typography, Space, Table, Tag, Button} from "antd";
import {useContent} from "../hooks/common/contentContext";
import {GithubOutlined} from "@ant-design/icons";
import {use} from "i18next";
const {Title, Text} = Typography;

const projectInfo = {
   members: [
      {
         key: "1",
         name: "Nguyễn Văn Phú",
         mssv: "2001216041",
         email: "vuonggiaphu.pct@gmail.com",
         github: "https://github.com/vanphudev",
      },
      {
         key: "2",
         name: "Phạm Thị Thanh Thúy",
         mssv: "2001216196",
         email: "thanhthuy0983860756@gmail.com",
         github: "https://github.com/thuyptt610",
      },
      {
         key: "3",
         name: "Phạm Thị Thanh Thủy",
         mssv: "2001216195",
         email: "pthithanhthuy59@gmail.com",
         github: "https://github.com/phamthanhthuy95",
      },
   ],
};

const columns = [
   {
      title: "STT",
      dataIndex: "key",
      key: "key",
   },
   {
      title: "Name Member",
      dataIndex: "name",
      key: "name",
   },
   {
      title: "MSSV",
      dataIndex: "mssv",
      key: "mssv",
   },
   {
      title: "Email",
      dataIndex: "email",
      key: "email",
   },
   {
      title: "Github",
      dataIndex: "github",
      key: "github",
      render: (text) => (
         <a href={text} target='_blank' rel='noopener noreferrer'>
            <Button icon={<GithubOutlined />} size='small'>
               Github
            </Button>
         </a>
      ),
   },
];

const TeamInfo = () => {
   const {isHeaderCustom, setIsHeaderCustom} = useContent();
   useEffect(() => {
      setIsHeaderCustom(true);
      return () => {
         setIsHeaderCustom(false);
      };
   }, []);
   return (
      <>
         <Helmet>
            <meta charSet='utf-8' />
            <title>Thông tin dự án - Futabus</title>
         </Helmet>
         <div
            style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            margin: "30px auto",
            borderRadius: "40px",
            border: "1px solid rgba(239, 82, 34, 0.6)",
            outline: "8px solid rgba(170, 46, 8, 0.1)",
         }}
         className='layout'>
         <Title level={1} style={{textAlign: "center", color: "#E7460C"}} className='uppercase'>
            Project Information
         </Title>
         <Space direction='vertical' style={{width: "100%"}}>
            <Text strong>Number of members: </Text>
            <Text>3</Text>
            <Text strong>Project name: </Text>
            <Text>Phuong Trang Website - Frontend Booking Tickets</Text>
            <Text strong>Description: </Text>
            <Text>
               This project is a website clone of Phuong Trang website. It is a graduation thesis project of the group.
            </Text>
            <Title level={2}>Members:</Title>
            <Space direction='vertical' size='small'>
               <Space>
                  <Tag color='blue'>Leader</Tag>
                  <Text>
                     <a href='https://github.com/vanphudev' target='_blank' rel='noopener noreferrer'>
                        Nguyễn Văn Phú
                     </a>
                  </Text>
               </Space>
               <Space>
                  <Tag color='green'>Member</Tag>
                  <Text>
                     <a href='https://github.com/thuyptt610' target='_blank' rel='noopener noreferrer'>
                        Phạm Thị Thanh Thúy
                     </a>
                  </Text>
               </Space>
               <Space>
                  <Tag color='green'>Member</Tag>
                  <Text>
                     <a href='https://github.com/phamthanhthuy95' target='_blank' rel='noopener noreferrer'>
                        Phạm Thị Thanh Thủy
                     </a>
                  </Text>
               </Space>
            </Space>

            <Title level={3}>Information Members:</Title>
            <Table
               columns={columns}
               dataSource={projectInfo.members}
               pagination={false}
               bordered
               size='middle'
               style={{backgroundColor: "#fff"}}
            />
         </Space>
         </div>
      </>
   );
};

export default TeamInfo;
