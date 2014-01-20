#encoding: utf-8
mail_config = {
        'MAIL_SERVER': 'smtp.gmail.com',
        'MAIL_PORT': 587, 
        'MAIL_USE_TLS': True,
        'MAIL_USER_NAME': 'kabsky9@gmail.com',
        'MAIL_PASSWORD': 'jalmoeijckdptkos', 
        'MAIL_DEBUG': True, 
        'MAIL_DEFAULT_SENDER': '948282320@qq.com'
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

params = {
        'RESPONSE_TYPE': 'code', 
        'CLIENT_ID': '619166640784-ddtj5snjjv01g26v6otfvns1ncissjd0.apps.googleusercontent.com', 
        'CLIENT_SECRET': 'zTE-_Ljfege61faalXKYTAyL', 
        'REDIRECT_URI': 'http://localhost:5000/oauth/oauth', 
        'SCOPE': ['email', 'https://www.googleapis.com/auth/admin.directory.user'], 
        # 'SCOPE': 'https://www.google.com/m8/feeds', 
        'STATE': 'abc', 
        'ACCESS_TYPE': 'online',
        'LOGIN_HINT': 'email' 
}
