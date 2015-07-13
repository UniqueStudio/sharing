define({ "api": [
  {
    "type": "delete",
    "url": "/comment",
    "title": "删除评论",
    "version": "0.1.0",
    "name": "DeleteComment",
    "group": "Comment",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过comment_id删除评论.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comment_id",
            "description": "<p>Id of comment.</p> "
          }
        ]
      }
    },
    "filename": "application/comment.py",
    "groupTitle": "Comment",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/comment?share_id=:share_id",
    "title": "获取评论",
    "version": "0.1.0",
    "name": "GetComment",
    "group": "Comment",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>根据share_id获取组内某条share的评论.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_id",
            "description": "<p>Id of share in group.</p> "
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
            "field": "comments",
            "description": "<p>Comments of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.id",
            "description": "<p>Id of comment.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.content",
            "description": "<p>Content of comment.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.time",
            "description": "<p>Time of comment.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.nickname",
            "description": "<p>Nickname of user who made this comment.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "comments.avatar",
            "description": "<p>Avatar of user who made this comment.</p> "
          }
        ]
      }
    },
    "filename": "application/comment.py",
    "groupTitle": "Comment",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/comment",
    "title": "发布评论",
    "version": "0.1.0",
    "name": "PostComment",
    "group": "Comment",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>只能对组内的share发表评论.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_id",
            "description": "<p>Id of share..</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "content",
            "description": "<p>Content of comment.</p> "
          }
        ]
      }
    },
    "filename": "application/comment.py",
    "groupTitle": "Comment",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/inbox_share",
    "title": "删除InboxShare",
    "version": "0.1.0",
    "name": "DeleteInboxShare",
    "group": "InboxShare",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过inbox_share_id删除InboxShare, 直接删除.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "inbox_share_id",
            "description": "<p>Id of share.</p> "
          }
        ]
      }
    },
    "filename": "application/inbox_share.py",
    "groupTitle": "InboxShare",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/inbox_share?inbox_share_id=:inbox_share_id",
    "title": "获取InboxShare",
    "version": "0.1.0",
    "name": "GetInboxShare",
    "group": "InboxShare",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>根据inbox_share_id从inbox中获取share，即从<code>@me</code>中获取share.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "in_share_id",
            "description": "<p>Id of share.</p> "
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
            "field": "id",
            "description": "<p>Id of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>Title of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "url",
            "description": "<p>Url of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "send_time",
            "description": "<p>Time of share created.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "nickname",
            "description": "<p>Name of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "uid",
            "description": "<p>Id of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "avatar",
            "description": "<p>Avatar of user.</p> "
          }
        ]
      }
    },
    "filename": "application/inbox_share.py",
    "groupTitle": "InboxShare",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/share",
    "title": "投递InboxShare（外部）",
    "version": "0.1.0",
    "name": "PostInboxShare",
    "group": "InboxShare",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>与投递到某个组的接口几乎相同，仅是groups为空数组.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>Title of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "url",
            "description": "<p>Title of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "comment",
            "description": "<p>Comment of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>Name of groups to send share.</p> "
          }
        ]
      }
    },
    "filename": "application/inbox_share.py",
    "groupTitle": "InboxShare",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/inbox_share",
    "title": "推送InboxShare到group",
    "version": "0.1.0",
    "name": "PutInboxShare",
    "group": "InboxShare",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过inbox_share_id和group_id推送InboxShare到特定的组.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "inbox_share_id",
            "description": "<p>Id of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>Id of group.</p> "
          }
        ]
      }
    },
    "filename": "application/inbox_share.py",
    "groupTitle": "InboxShare",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/gratitude",
    "title": "取消感谢",
    "version": "0.1.0",
    "name": "DeleteGratitude",
    "group": "Share",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过share_id取消感谢.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_id",
            "description": "<p>Id of share.</p> "
          }
        ]
      }
    },
    "filename": "application/share.py",
    "groupTitle": "Share",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/share",
    "title": "删除share",
    "version": "0.1.0",
    "name": "DeleteShare",
    "group": "Share",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过share_id删除share. 组内share的删除动作默认仅减少share users，当分享的人数为0的时候， 这条share才会删除。</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_id",
            "description": "<p>Id of share.</p> "
          }
        ]
      }
    },
    "filename": "application/share.py",
    "groupTitle": "Share",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/share?share_id=:share_id",
    "title": "获取组内某条share",
    "version": "0.1.0",
    "name": "GetShare",
    "group": "Share",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>根据share_id获取组内某条share.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_id",
            "description": "<p>Id of share in group.</p> "
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
            "field": "id",
            "description": "<p>Id of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>Title of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "url",
            "description": "<p>Url of share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_time",
            "description": "<p>Time of share created.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "comment_sum",
            "description": "<p>Sum of comments.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "gratitude_sum",
            "description": "<p>Sum of users gratitude.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "origin",
            "description": "<p>First user who made this share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "origin.nickname",
            "description": "<p>Name of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "origin.id",
            "description": "<p>Id of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "origin.avatar",
            "description": "<p>Avatar of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "others",
            "description": "<p>The rest users.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "others.nickname",
            "description": "<p>Name of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "others.id",
            "description": "<p>Id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/share.py",
    "groupTitle": "Share",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/accept",
    "title": "同意入组",
    "version": "0.1.0",
    "name": "AcceptApply",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "admin",
        "title": "To be the admin of this group.",
        "description": ""
      }
    ],
    "description": "<p>管理员通过入组申请.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>The id of group.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "apply_user_id",
            "description": "<p>The id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/apply_users?group_id=:group_id",
    "title": "获取申请入组的人员",
    "version": "0.1.0",
    "name": "ApplyUser",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "admin",
        "title": "To be the admin of this group.",
        "description": ""
      }
    ],
    "description": "<p>根据group_id获取组内申请入组人员的信息.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
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
            "field": "users.nickname",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/change_admin",
    "title": "管理员转让",
    "version": "0.1.0",
    "name": "ChangeAdmin",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "admin",
        "title": "To be the admin of this group.",
        "description": ""
      }
    ],
    "description": "<p>管理员通过可以转让管理员的职位给组员.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>The id of group.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user_id",
            "description": "<p>The id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
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
    "url": "/group?group_name=:group_name",
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
    "description": "<p>根据name来搜索group信息.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_name",
            "description": "<p>The name of group.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/info",
    "title": "查询组信息，包括成员",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/shares?group_id=:group_id",
    "title": "获取组内的share",
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
            "field": "group_id",
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
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.share_time",
            "description": "<p>Time when share first made.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "shares.comment_sum",
            "description": "<p>The sum of comments.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "shares.origin",
            "description": "<p>First author of this share.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.origin.nickname",
            "description": "<p>Name of first author.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.origin.id",
            "description": "<p>Id of first author.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.origin.avatar",
            "description": "<p>Avatar of first author.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "shares.origin.others",
            "description": "<p>The rest of user who shared it.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.origin.others.id",
            "description": "<p>Id of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "shares.origin.others.nickname",
            "description": "<p>Name of user.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/users?group_id=:group_id",
    "title": "获取组内的user信息",
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
            "field": "group_id",
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
            "type": "<p>String</p> ",
            "optional": false,
            "field": "admin_id",
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
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "users.avatar",
            "description": "<p>The avatar of users.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "users.gratitude_shares_sum",
            "description": "<p>The sum of gratitude.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "users.share_sum",
            "description": "<p>The num of shares.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/group/reject",
    "title": "拒绝入组",
    "version": "0.1.0",
    "name": "RejectApply",
    "group": "ShareGroup",
    "permission": [
      {
        "name": "admin",
        "title": "To be the admin of this group.",
        "description": ""
      }
    ],
    "description": "<p>管理员拒绝入组申请.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>The id of group.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "apply_user_id",
            "description": "<p>The id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/share_group.py",
    "groupTitle": "ShareGroup",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": \"该组不存在\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/gratitude",
    "title": "感谢",
    "version": "0.1.0",
    "name": "PostGratitude",
    "group": "Share",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过share_id向别人投递感谢，感谢成功后发送通知给对方. share必须为组分享到内的share</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "share_id",
            "description": "<p>Id of share.</p> "
          }
        ]
      }
    },
    "filename": "application/share.py",
    "groupTitle": "Share",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/share",
    "title": "投递share（外部）",
    "version": "0.1.0",
    "name": "PostShare",
    "group": "Share",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>从外部投递share，如果不选发送组，则发送到@me， 接口对应inbox_share，这点需<strong>格外注意</strong></p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "title",
            "description": "<p>Title of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "url",
            "description": "<p>Title of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "comment",
            "description": "<p>Comment of share.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>Name of groups to send share.</p> "
          }
        ]
      }
    },
    "filename": "application/share.py",
    "groupTitle": "Share",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/user/accept/:key",
    "title": "接受邀请",
    "version": "0.1.0",
    "name": "AcceptInvite",
    "group": "User",
    "description": "<p>通过key来接受邀请，key默认在邀请链接中. 用户应当已是share注册用户，这样才能使用这个接口接受邀请.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "key",
            "description": "<p>Key of invite.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/group/apply",
    "title": "申请加组",
    "version": "0.1.0",
    "name": "ApplyGroup",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>已登陆的用户可以直接用组名申请加组.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_name",
            "description": "<p>Name of group.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/black",
    "title": "拉黑",
    "version": "0.1.0",
    "name": "Black",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>拉黑用户，不再接收其share.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "blacked_user_id",
            "description": "<p>Id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/cancel_black",
    "title": "取消拉黑",
    "version": "0.1.0",
    "name": "CancelBlack",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>取消拉黑用户.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "cancelled_user_id",
            "description": "<p>Id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/unfollow",
    "title": "取消关注",
    "version": "0.1.0",
    "name": "CancelFollow",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>取关.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "unfollow_user_id",
            "description": "<p>Id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/user/notify",
    "title": "删除通知",
    "version": "0.1.1",
    "name": "DeleteNotify",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过notify_id删除通知，注意参数notify_id为一数组，将需要删除的 评论的id添加到该数组中，服务器将删除数组中所有对应的通知.</p> ",
    "header": {
      "examples": [
        {
          "title": "Header-Example",
          "content": "{\n    \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": false,
            "field": "notify_id",
            "description": "<p>Id of notify.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example",
          "content": "{\n    \"notify_id\":[\n        ...\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "application/notify.py",
    "groupTitle": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/follow",
    "title": "关注",
    "version": "0.1.0",
    "name": "Follow",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>关注用户，具体功能待定.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "followed_user_id",
            "description": "<p>Id of user.</p> "
          }
        ]
      }
    },
    "filename": "application/user.py",
    "groupTitle": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/setting",
    "title": "个人设置",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/user/notify",
    "title": "获取通知（测试用）",
    "version": "0.1.0",
    "name": "GetNotify",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>获取未读的所有通知. notify_type包括:<code>COMMENT</code>, <code>SHARE</code>, <code>FOLLOW</code>, <code>GRATITUDE</code>, <code>ADMIN</code>, <code>INVITE</code>, <code>FRESH_MEMBER</code>.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "notifies",
            "description": "<p>Notifies of user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "notifies.notify",
            "description": "<p>Check examples below for detail.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "COMMENT",
          "content": "//别人对自己的share的评论\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"COMMENT\",\n    \"time\": time,\n    \"comment_id\": comment.id,\n    \"title\": share.title,\n    \"content\": comment.content,\n    \"user_id\": comment.user.id,\n    \"nickname\": comment.user.nickname,\n    \"avatar\": comment.user.avatar\n}",
          "type": "json"
        },
        {
          "title": "SHARE",
          "content": "//关注的人发送的share\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"SHARE\",\n    \"time\": time,\n    \"share_id\": share.id,\n    \"title\": share.title,\n    \"user_id\": share.user.id,\n    \"nickname\": share.user.nickname,\n    \"avatar\": share.user.avatar\n}",
          "type": "json"
        },
        {
          "title": "FOLLOW",
          "content": "//增加粉丝\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"FOLLOW\",\n    \"time\": time,\n    \"user_id\": user.id,\n    \"nickname\": user.nickname,\n    \"avatar\": user.avatar\n}",
          "type": "json"
        },
        {
          "title": "GRATITUDE",
          "content": "//收到感谢\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"GRATITUDE\",\n    \"time\": time,\n    \"title\": share.title,\n    \"user_id\": user.id,\n    \"nickname\": user.nickname,\n    \"avatar\": user.avatar\n}",
          "type": "json"
        },
        {
          "title": "ADMIN",
          "content": "//管理员变更\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"ADMIN\",\n    \"time\": time,\n    \"group_id\": group.id,\n    \"group_name\": group.name,\n    \"user_id\": new_admin.id,\n    \"nickname\": new_admin.nickname,\n    \"avatar\": new_admin.avatar\n}",
          "type": "json"
        },
        {
          "title": "INVITE",
          "content": "//收到加组邀请\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"INVITE\",\n    \"time\": time,\n    \"key\": invite.key,\n    \"group_id\": group.id,\n    \"group_name\": group.name,\n    \"user_id\": inviter.id,\n    \"nickname\": inviter.nickname,\n    \"avatar\": inviter.avatar\n}",
          "type": "json"
        },
        {
          "title": "FRESH_MEMBER",
          "content": "//新人入组\n\nHTTP/1.1 200 OK\n{\n    \"id\": notify.id,\n    \"notify_type\": \"FRESH_MEMBER\",\n    \"time\": time,\n    \"group_id\": group.id,\n    \"group_name\": group.name,\n    \"user_id\": user.id,\n    \"nickname\": user.nickname,\n    \"avatar\": user.avatar\n}",
          "type": "json"
        }
      ]
    },
    "filename": "application/notify.py",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/homepage[?uid=:uid]",
    "title": "个人主页",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/invite",
    "title": "邀请注册",
    "version": "0.1.0",
    "name": "InviteByEmail",
    "group": "User",
    "permission": [
      {
        "name": "login",
        "title": "Login to get permission.",
        "description": ""
      }
    ],
    "description": "<p>通过邮件的形式邀请注册，若成功，则返回邀请码， 用户可直接使用. 邀请码目前没有时间限制，任何人均可使用，使用一次后失效.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "group_id",
            "description": "<p>Id of group.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email of user to be invited.</p> "
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
            "field": "message",
            "description": "<p>Success.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "key",
            "description": "<p>The key to join group.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/login",
    "title": "登录",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/logout",
    "title": "注销",
    "version": "0.1.0",
    "name": "Logout",
    "group": "User",
    "description": "<p>注销当前登录.</p> ",
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/setting",
    "title": "修改个人设置",
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
            "defaultValue": "0,1",
            "description": "<p>Gender of user.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/register/:key",
    "title": "注册并加入组",
    "version": "0.1.0",
    "name": "Register",
    "group": "User",
    "description": "<p>通过key来注册share，key在邀请的链接中. 注册完成后用户将自动成为待进组的状态，接下来只需该组管理员的审核.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "key",
            "description": "<p>Key of invite(already in url).</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "nickname",
            "description": "<p>Nickname as account.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/register",
    "title": "注册(测试用)",
    "version": "0.1.0",
    "name": "RegisterTest",
    "group": "User",
    "description": "<p>直接使用邮箱密码注册share账户.</p> ",
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
            "field": "nickname",
            "description": "<p>Nickname as account.</p> "
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
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"failure\",\n  \"reason\": String\n}",
          "type": "json"
        }
      ]
    }
  }
] });