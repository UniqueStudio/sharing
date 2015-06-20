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