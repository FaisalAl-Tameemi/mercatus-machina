#!/usr/bin/env python

from json import dumps as jsonify
from flask import Response

def sql_to_json(sql_results):
	return jsonify([(dict(row.items())) for row in sql_results])

def jsonResponse(data, sql=True, status=200):
	return Response(
		sql_to_json(data) if sql else data,
		mimetype='application/json',
		status=status
	)
