#encoding: utf-8
mail_config = {
        'MAIL_SERVER': 'smtp.gmail.com',
        'MAIL_PORT': 587, 
        'MAIL_USE_TLS': True,
        'MAIL_USERNAME': 'share@hustunique.com',
        'MAIL_PASSWORD': 'hustshare', 
        'MAIL_DEFAULT_SENDER': ('Share', 'share@hustunique.com')
}

constance = {
        'login': 'login.html', 
        'register': 'register.html', 
        'index': 'index.html', 
        'profile': 'profile.html', 
        'reading': 'reading2.html', 
        'content': 'content.html', 
        'per_page': 3,
        'comment_per_page': 3,
        'download_folder': '/home/z_sky/unique/flask/sharing2/download_files'
}



TEST_URL = 'http://www.uniqueguoqi.com:5000'
# TEST_URL = 'http://share.hustunique.com'
