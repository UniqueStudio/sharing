#encoding:utf-8

from application.models import User, ShareGroup, Share, InboxShare, Comment
import unittest

class UserTestCase(unittest.TestCase):
    def setUp(self):
        self.email_1 = '498283580@qq.com'
        self.nickname_1 = 'Bing'
        self.password_1 = '771819'
        self.user_1 = User(email=self.email_1, nickname=self.nickname_1)
        self.user_1.set_password(self.password_1)
        self.user_1.save()

        #创建个组进行测试
        self.group = ShareGroup(name='test', create_user=self.user_1)
        self.group.save()
        self.user_1.manager_groups.append(self.group)
        self.user_1.admin_allow_user_entry(self.user_1, self.group)

        #创建第二个用户测试
        self.email_2 = "1234567@qq.com"
        self.password_2 = '123456'
        self.nickname_2 = 'tttt'
        self.user_2 = User(email=self.email_2, nickname=self.nickname_2)
        self.user_2.set_password(self.password_2)
        self.user_2.save()

        #创建一个share进行测试
        self.share = Share(title='test', url='http://www.baidu.com')
        self.share.save()

        #创建一个inbox_share进行测试
        self.inbox_share = InboxShare(title='test', url='http://www.baidu.com')
        self.inbox_share.save()

    def tearDown(self):
        self.user_1.delete()
        self.user_2.delete()
        self.group.delete()
        self.share.delete()
        self.inbox_share.delete()

    def test_set_password(self):
        password = self.user_1.set_password('123456')
        self.user_1.save()
        self.assertEqual(self.user_1.password, password)

    def test_check_password(self):
        self.assertTrue(self.user_1.check_password(self.password_1))

    def test_is_exist(self):
        self.assertTrue(User.is_exist(self.email_1))

    def test_is_in_the_group(self):
        self.assertTrue(self.user_1.is_in_the_group(self.group))

    def test_remove_the_group(self):
        self.user_1.admin_allow_user_entry(user=self.user_2, group=self.group)
        self.user_2.remove_the_group(self.group)
        self.assertTrue(self.user_1.is_in_the_group(self.group))

    def test_share_to_group(self):
        self.user_1.share_to_group(share=self.share, group=self.group)
        self.user_2.share_to_group(share=self.share, group=self.group)

    def test_is_share(self):
        self.user_1.share_to_group(share=self.share, group=self.group)
        self.assertTrue(self.user_1.is_share(share=self.share, group=self.group))

    def test_remove_share_to_group(self):
        self.user_1.share_to_group(share=self.share, group=self.group)
        self.assertTrue(self.user_1.is_share(share=self.share, group=self.group))
        self.user_1.remove_share_to_group(share=self.share, group=self.group)
        self.assertFalse(self.user_1.is_share(share=self.share, group=self.group))

    def test_gratitude(self):
        self.user_1.share_to_group(share=self.share, group=self.group)
        self.user_1.gratitude(self.share)
        self.user_2.gratitude(self.share)
        self.user_2.gratitude(self.share)
        self.assertEqual(self.share.gratitude_num, 1)

    def test_add_inbox_share(self):
        self.user_1.add_inbox_share(self.inbox_share)
        inbox_share = InboxShare.objects(title='test', url='http://www.baidu.com').first()
        self.assertEqual(inbox_share, self.inbox_share)

    def test_is_in_inbox(self):
        self.user_1.add_inbox_share(self.inbox_share)
        self.assertTrue(self.user_1.is_in_inbox(self.inbox_share))

    def test_remove_inbox_share(self):
        self.user_1.add_inbox_share(self.inbox_share)
        self.user_1.remove_inbox_share(self.inbox_share)
        self.assertFalse(self.user_1.is_in_inbox(self.inbox_share))

    def test_send_share(self):
        self.user_1.add_inbox_share(self.inbox_share)
        self.user_1.send_share(inbox_share=self.inbox_share, group=self.group)
        self.assertTrue(Share.is_exist(url=self.inbox_share.url, group=self.group))
        self.assertFalse(InboxShare.is_exist(url=self.inbox_share.url, own_user=self.user_1))

    def test_add_comment_to_share(self):
        self.user_1.add_comment_to_share(self.share, 'test')
        comment = Comment.objects().first()
        self.assertEqual(comment.content, 'test')
        comment.delete()

    def test_remove_comment_to_share(self):
        self.user_1.add_comment_to_share(self.share, 'test')
        comment = Comment.objects().first()
        self.user_1.remove_comment_to_share(self.share, comment.id)
        comment = Comment.objects().first()
        self.assertFalse(comment)

    #TODO:关注，拉黑，通知，管理员测试

def suite_test():
    suite = unittest.TestSuite()
    suite.addTest(UserTestCase('test_set_password'))
    suite.addTest(UserTestCase('test_check_password'))
    suite.addTest(UserTestCase('test_is_exist'))
    suite.addTest(UserTestCase('test_is_in_the_group'))
    suite.addTest(UserTestCase('test_remove_the_group'))
    suite.addTest(UserTestCase('test_share_to_group'))
    suite.addTest(UserTestCase('test_is_share'))
    suite.addTest(UserTestCase('test_remove_share_to_group'))
    suite.addTest(UserTestCase('test_gratitude'))
    suite.addTest(UserTestCase('test_add_inbox_share'))
    suite.addTest(UserTestCase('test_is_in_inbox'))
    suite.addTest(UserTestCase('test_send_share'))
    suite.addTest(UserTestCase('test_add_comment_to_share'))
    suite.addTest(UserTestCase('test_remove_comment_to_share'))
    return suite

if __name__ == '__main__':
    # To run this test, use '-m' with python in root directory
    unittest.main(defaultTest='suite_test')
