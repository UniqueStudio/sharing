define({ "api": [
  {
    "type": "post",
    "url": "/group",
    "title": "新建一个share组",
    "version": "0.1.0",
    "name": "CreateGroup",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>首先检查是否有相同名字的组，如果没有，则直接创建该组， 执行此操作的人自动成为管理员。否则报错。</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>the name of group to be created.</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GroupExist",
            "description": "<p>The group exists.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组已存在\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>message = success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"success\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group",
    "title": "搜索share组",
    "version": "0.1.0",
    "name": "GetGroup",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>根据id或者name来搜索group信息,两个之间必须提供一个条件.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>the name of group.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "id",
            "description": "<p>the id of group.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_name",
            "description": "<p>The name of group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>The id of group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "create_time",
            "description": "<p>The time of group created.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GroupNotFound",
            "description": "<p>Can not find the group.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/info",
    "title": "查询share组信息，包括成员",
    "version": "0.1.0",
    "name": "GetGroupInfo",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "member",
        "title": "To be member of this group",
        "description": ""
      }
    ],
    "description": "<p>根据id或者name来搜索group信息,两个之间必须提供一个条件.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>the name of group.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "id",
            "description": "<p>the id of group.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_name",
            "description": "<p>The name of group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>The id of group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "create_time",
            "description": "<p>The time of group created.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "admin",
            "description": "<p>Admin of the group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "admin.name",
            "description": "<p>The name of admin.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "admin.id",
            "description": "<p>The id of admin.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>Users in the group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "users.name",
            "description": "<p>The name of users.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "users.id",
            "description": "<p>The id of users.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GroupNotFound",
            "description": "<p>Can not find the group.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/shares",
    "title": "获取组内的share.",
    "version": "0.1.0",
    "name": "GetGroupShare",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "member",
        "title": "To be member of this group",
        "description": ""
      }
    ],
    "description": "<p>根据group_id获取组内share.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of group.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "shares",
            "description": "<p>Shares in the group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.title",
            "description": "<p>The title of shares.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.id",
            "description": "<p>The id of shares.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GroupNotFound",
            "description": "<p>Can not find the group.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotLogin",
            "description": "<p>Users must login to invoke this api.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/users",
    "title": "获取组内的user信息.",
    "version": "0.1.0",
    "name": "GetGroupUser",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "member",
        "title": "To be member of this group",
        "description": ""
      }
    ],
    "description": "<p>根据group_id获取组内user.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of group.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>Users in the group.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "users.name",
            "description": "<p>The name of users.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "users.id",
            "description": "<p>The id of users.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GroupNotFound",
            "description": "<p>Can not find the group.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotLogin",
            "description": "<p>Users must login to invoke this api.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/setting",
    "title": "Personal setting",
    "version": "0.1.0",
    "name": "GetMyInformation",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>查询个人信息，仅对自己有效.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "nickname",
            "description": "<p>Nickname of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Id of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "avatar",
            "description": "<p>Avatar of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "is_man",
            "description": "<p>Gender of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "brief",
            "description": "<p>Self description of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "education_information",
            "description": "<p>Education information of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "phone_number",
            "description": "<p>Phone number of user.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotLogin",
            "description": "<p>Users must login to invoke this api.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/homepage[?uid=:uid]",
    "title": "Homepage",
    "version": "0.1.0",
    "name": "Homepage",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>查看个人主页内容，包括分享的share. 如果加上可选的uid，则可以看到这个uid对应用户的信息， 其同组的share可见，否则不可见. 带optional的返回字段仅自己可见.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "uid",
            "description": "<p>User id.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "nickname",
            "description": "<p>Nickname of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Id of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "avatar",
            "description": "<p>Avatar of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "is_man",
            "description": "<p>Gender of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "brief",
            "description": "<p>Self description of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "register_time",
            "description": "<p>Register time of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>Groups of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groups.id",
            "description": "<p>Id of groups.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groups.name",
            "description": "<p>Name of groups.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "shares",
            "description": "<p>Shares of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.id",
            "description": "<p>Id of shares.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.title",
            "description": "<p>Title of shares.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.group",
            "description": "<p>Group of shares.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.share_time",
            "description": "<p>Time shared.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "gratitude_shares_sum",
            "description": "<p>The sum of gratitude received.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "comment_sum",
            "description": "<p>The sum of comments made before.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "black_users_sum",
            "description": "<p>The sum of user in blacklist.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "followers_sum",
            "description": "<p>The sum of followers.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "following_sum",
            "description": "<p>The sum of following.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotLogin",
            "description": "<p>Users must login to invoke this api.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "version": "0.1.0",
    "name": "Login",
    "group": "User",
    "description": "<p>使用邮箱密码登录.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email as account.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>message = success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SomeErrorInDetail",
            "description": "<p>Errors in detail.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/setting",
    "title": "Update personal info.",
    "version": "0.1.0",
    "name": "PostMyInformation",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>修改个人信息.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": true,
            "field": "is_man",
            "defaultValue": "0,",
            "description": "<p>1] Gender of user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "brief",
            "description": "<p>Self description of user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "education_information",
            "description": "<p>Education information of user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "phone_number",
            "description": "<p>Phone number of user.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotLogin",
            "description": "<p>Users must login to invoke this api.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SomeErrorInDetail",
            "description": "<p>Errors in detail.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/register",
    "title": "Register",
    "version": "0.1.0",
    "name": "Register",
    "group": "User",
    "description": "<p>使用邮箱密码注册share账户，测试用.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email as account.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>message = success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"success\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SomeErrorInDetail",
            "description": "<p>Errors in detail.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  }
] });