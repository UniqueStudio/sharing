#encoding: utf-8
import urllib2
import re

class DOM():
	__url__ = None
	title = None
	content = None
	def __init__(self, url):
		# 这里需要加url检验, 并且能够转换为标准的url
		self.__url__ = url

	def getTitle(self):
		request = urllib2.Request(self.__url__)
		response = urllib2.urlopen(request)
		dom = response.read().decode('utf-8')

		title_pattern = re.compile('<title>.*</title>?', re.S)

		match = title_pattern.findall(dom)

		result = []
		for value in match:
			tmp_str = value[(value.find('<title>') + len('<title>')) : value.find('</title>')]
			result.append(tmp_str)

		return result[0]

