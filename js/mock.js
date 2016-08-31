// www.json-generator.com

var mock_template = {
	"results":
		[
		'{{ repeat(2, 3) }}',
			{
				"dip": '{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}',
				"sip": '{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}.{{ integer(0,255) }}',
				"path": function(tags, idx) {
					return [ this.dip, "*", this.sip ];
				},
				"observations": [
				'{{ repeat(50, 100) }}',
					{
						//"path": ["188.166.146.182", "*", "1.1.126.17"],
						"value": {},
						"conditions": [
							'{{ random("ecn.connectivity.works","ecn.connectivity.broken") }}',
							'ecn.negotiated'
							],
						"analyzer": "analyzer-ecnspider1",
						"time": function(tags, idx) {
							var dateFrom = tags.integer(145160640000, 148322880000);
							var dateDelta = tags.integer(1000, 60000);
							return {
								"from": {"$date": dateFrom },
								"to": {"$date": dateFrom + dateDelta}
							};
						}
					}
				]
			}
		],
	"count": "over 9000"
};

var genN = function(n, obj) {
  return Array(n).fill(obj);
};

var rndInt = function(min, max) {
  return function() {
    return min + Math.floor((max - min) * Math.random());
  }
};

var rndVal = function(values) {
  return function() {
    return values[Math.round( (values.length - 1) * Math.random() )];
  }
};

var rndIP = function() {
  return function() {
    return rndInt(0, 255)() + "." + rndInt(0, 255)() + "." + rndInt(0, 255)() + "." + rndInt(0, 255)();
  }
};

var mock_template_gen = function(nPath, nObs) {
  return {
    "results": genN(nPath,
        {
          "dip": rndIP(),
          "sip": rndIP(),
          "path": function() {
            return [ this.dip, "*", this.sip ];
          },
          "observations": genN(nObs,
            {
              "value": {},
              "conditions": [
                rndVal(["ecn.connectivity.works","ecn.connectivity.broken"]),
                'ecn.negotiated'
                ],
              "analyzer": "MOCK",
              "time": function() {
                var dateFrom = rndInt(145160640000, 148322880000)();
                var dateDelta = rndInt(1000, 60000)();
                return {
                  "from": {"$date": dateFrom },
                  "to": {"$date": dateFrom + dateDelta}
                };
              }
            }
          )
        }
      ),
    "count": "over 9000"
  };
};

var generateMock = function(tpl) {
  if (_.isFunction(tpl)) {
    return tpl();
  }

  if (_.isArray(tpl)) {
    return _.map(tpl, generateMock);
  }

  if (_.isObject(tpl)) {
    return _.mapObject(tpl, generateMock);
  }

  return tpl;
};

var addPaths = function(mock) {
  mock.results = _.map(mock.results, function(result) {
    result.path = [result.sip, "*", result.dip];
    result.observations = _.map(result.observations, function(obs) {
      obs.path = result.path;
      return obs;
    });
    return result;
  });
};

var mockResult = {
  "results": [
    {
      "dip": "236.222.61.31",
      "sip": "222.79.234.162",
      "path": [
        "236.222.61.31",
        "*",
        "222.79.234.162"
      ],
      "observations": [
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145680505232
            },
            "to": {
              "$date": 145680552681
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148090835307
            },
            "to": {
              "$date": 148090876979
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147202745857
            },
            "to": {
              "$date": 147202783353
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148147289877
            },
            "to": {
              "$date": 148147347048
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146383458361
            },
            "to": {
              "$date": 146383471351
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146532143460
            },
            "to": {
              "$date": 146532185275
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147412910467
            },
            "to": {
              "$date": 147412927350
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146669358455
            },
            "to": {
              "$date": 146669391280
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147991624999
            },
            "to": {
              "$date": 147991654144
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147316846483
            },
            "to": {
              "$date": 147316903052
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147031123638
            },
            "to": {
              "$date": 147031132983
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146874021377
            },
            "to": {
              "$date": 146874063402
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145985412015
            },
            "to": {
              "$date": 145985450619
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145998554577
            },
            "to": {
              "$date": 145998610383
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146273943877
            },
            "to": {
              "$date": 146273998367
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145671466011
            },
            "to": {
              "$date": 145671493346
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148256441943
            },
            "to": {
              "$date": 148256480313
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146873523934
            },
            "to": {
              "$date": 146873572651
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147005332096
            },
            "to": {
              "$date": 147005391893
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146046393910
            },
            "to": {
              "$date": 146046429202
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145533406517
            },
            "to": {
              "$date": 145533450760
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148184280828
            },
            "to": {
              "$date": 148184303590
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145854059347
            },
            "to": {
              "$date": 145854067566
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146620407968
            },
            "to": {
              "$date": 146620428292
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147691168704
            },
            "to": {
              "$date": 147691175411
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148174567946
            },
            "to": {
              "$date": 148174571864
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148080171498
            },
            "to": {
              "$date": 148080231323
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147214395251
            },
            "to": {
              "$date": 147214429479
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148177066882
            },
            "to": {
              "$date": 148177081214
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147324354590
            },
            "to": {
              "$date": 147324374102
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147668978408
            },
            "to": {
              "$date": 147669005339
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146700786565
            },
            "to": {
              "$date": 146700836980
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147651128333
            },
            "to": {
              "$date": 147651136608
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146081014470
            },
            "to": {
              "$date": 146081030874
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148064562304
            },
            "to": {
              "$date": 148064616623
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148232330079
            },
            "to": {
              "$date": 148232353220
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146173158153
            },
            "to": {
              "$date": 146173192997
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146078858421
            },
            "to": {
              "$date": 146078911492
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146179993147
            },
            "to": {
              "$date": 146180042110
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147892311197
            },
            "to": {
              "$date": 147892347793
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145607437984
            },
            "to": {
              "$date": 145607475005
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148009600001
            },
            "to": {
              "$date": 148009653985
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145236908243
            },
            "to": {
              "$date": 145236959151
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146767322586
            },
            "to": {
              "$date": 146767324359
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147366511377
            },
            "to": {
              "$date": 147366551719
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146810678781
            },
            "to": {
              "$date": 146810715792
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147458153029
            },
            "to": {
              "$date": 147458195536
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148014875750
            },
            "to": {
              "$date": 148014897151
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146990001054
            },
            "to": {
              "$date": 146990014191
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145688869136
            },
            "to": {
              "$date": 145688881583
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146307224643
            },
            "to": {
              "$date": 146307248936
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148065386055
            },
            "to": {
              "$date": 148065397772
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145579825970
            },
            "to": {
              "$date": 145579879211
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145806938828
            },
            "to": {
              "$date": 145806944823
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146944318285
            },
            "to": {
              "$date": 146944347612
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146733720603
            },
            "to": {
              "$date": 146733772389
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146442473607
            },
            "to": {
              "$date": 146442476398
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145875024991
            },
            "to": {
              "$date": 145875026230
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145927067369
            },
            "to": {
              "$date": 145927118639
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147048306540
            },
            "to": {
              "$date": 147048308790
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145702964100
            },
            "to": {
              "$date": 145703022140
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146508612015
            },
            "to": {
              "$date": 146508615510
            }
          }
        }
      ]
    },
    {
      "dip": "34.249.203.8",
      "sip": "31.91.191.11",
      "path": [
        "34.249.203.8",
        "*",
        "31.91.191.11"
      ],
      "observations": [
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146713450646
            },
            "to": {
              "$date": 146713452810
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148060438682
            },
            "to": {
              "$date": 148060445977
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145315168206
            },
            "to": {
              "$date": 145315221863
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145605154440
            },
            "to": {
              "$date": 145605211480
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147483032879
            },
            "to": {
              "$date": 147483077271
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145469161737
            },
            "to": {
              "$date": 145469183434
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146426013854
            },
            "to": {
              "$date": 146426049646
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146142888685
            },
            "to": {
              "$date": 146142946553
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146898883254
            },
            "to": {
              "$date": 146898911327
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147223172861
            },
            "to": {
              "$date": 147223180697
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145245830418
            },
            "to": {
              "$date": 145245847941
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146292347330
            },
            "to": {
              "$date": 146292391464
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145260993446
            },
            "to": {
              "$date": 145261016161
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145272595392
            },
            "to": {
              "$date": 145272602188
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145424955380
            },
            "to": {
              "$date": 145424968281
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145836289712
            },
            "to": {
              "$date": 145836291393
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146829613473
            },
            "to": {
              "$date": 146829622329
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146400181593
            },
            "to": {
              "$date": 146400188472
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147207715255
            },
            "to": {
              "$date": 147207741500
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145958432281
            },
            "to": {
              "$date": 145958475455
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147568144878
            },
            "to": {
              "$date": 147568171241
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147905516093
            },
            "to": {
              "$date": 147905548345
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145628014478
            },
            "to": {
              "$date": 145628067134
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146400703333
            },
            "to": {
              "$date": 146400725919
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146567528652
            },
            "to": {
              "$date": 146567567163
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146922514158
            },
            "to": {
              "$date": 146922556607
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147438929980
            },
            "to": {
              "$date": 147438948528
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147626454109
            },
            "to": {
              "$date": 147626466870
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146331301005
            },
            "to": {
              "$date": 146331336154
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147829801200
            },
            "to": {
              "$date": 147829821548
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146694216459
            },
            "to": {
              "$date": 146694261742
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148113040133
            },
            "to": {
              "$date": 148113055106
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148303426957
            },
            "to": {
              "$date": 148303477071
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146890182366
            },
            "to": {
              "$date": 146890237780
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147401523857
            },
            "to": {
              "$date": 147401574096
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147727216843
            },
            "to": {
              "$date": 147727261580
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146792016984
            },
            "to": {
              "$date": 146792046540
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146489709951
            },
            "to": {
              "$date": 146489741953
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146998427206
            },
            "to": {
              "$date": 146998479130
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145991022768
            },
            "to": {
              "$date": 145991067378
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146214624270
            },
            "to": {
              "$date": 146214669232
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146933281782
            },
            "to": {
              "$date": 146933334224
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147743594532
            },
            "to": {
              "$date": 147743648489
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 148228476218
            },
            "to": {
              "$date": 148228486893
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.broken",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145804256583
            },
            "to": {
              "$date": 145804296838
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147808870089
            },
            "to": {
              "$date": 147808901769
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 146801600719
            },
            "to": {
              "$date": 146801636954
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145434312244
            },
            "to": {
              "$date": 145434334796
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 147124200805
            },
            "to": {
              "$date": 147124256582
            }
          }
        },
        {
          "value": {},
          "conditions": [
            "ecn.connectivity.works",
            "ecn.negotiated"
          ],
          "analyzer": "analyzer-ecnspider1",
          "time": {
            "from": {
              "$date": 145661176361
            },
            "to": {
              "$date": 145661189273
            }
          }
        }
      ]
    }
  ],
  "count": "over 9000"
};