
requirejs(['../../asset/lib/config'], function (config) {
    require(['Vue', 'common', 'callApi', 'globalVariable', 'jquery-ui']
        , function (Vue, common, CallApi, GlobalVariable) {
            new Vue({
                el: '#PageMainContainer',
                data: {
                    TrustID: null,
                    Periods: [],
                    PeriodTimeLineWidth: 600,
                    DaysArr: [],
                    AllFees: [],
                    AllFees_OptionSource: [],
                    AllEvents: [],
                    PeriodDetail: {
                        Index: null,
                        Start: null,
                        End: null,
                        Days: 0,
                        Dates: [],
                        Fees: [],
                        Events: [],
                        Scenarios: []
                    },
                    FeeDetail: null
                },
                watch: {
                    Periods: function (val, oldVal) {
                        $("#DC_TimeLine li").eq(0).trigger("click");
                    },
                    'PeriodDetail.Dates': function (val, oldVal) {
                        var hrWidth = $('#hrPeriodTimeline').width();
                        if (hrWidth > this.PeriodTimeLineWidth) {
                            this.PeriodTimeLineWidth = hrWidth;
                        }

                        var self = this;
                        $(".period-detail .period-dates .date").not(":first, :last").draggable({
                            axis: "x",
                            cursor: "move",
                            containment: "parent",
                            drag: function (event, ui) {
                                var left = ui.position.left;

                                var d = self.showDate(left);
                                $(this).find(".date-day").text(d);
                            },
                            stop: function (event, ui) {
                                var dateIndex = $(this).index();
                                self.PeriodDetail.Dates[dateIndex].Date = $(this).find(".date-day").text();

                                var $_this = $(this)
                                var dateIndex = $(this).index();
                                self.PeriodDetail.Dates[dateIndex].Date = self.showDate(ui.position.left);
                                var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_DateUpdate', true);
                                callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                                callApi.AddParam({ Name: 'EventID', Value: self.PeriodDetail.Dates[dateIndex].EventID, DBType: 'int' });
                                callApi.AddParam({ Name: 'StartDate', Value: self.PeriodDetail.Dates[dateIndex].Date, DBType: 'date' });
                                callApi.ExecuteNoQuery(function (response) {
                                    var msg = '更新成功!';
                                    if (response > 0) {
                                        msg = '更新失败!';
                                    }
                                    alert(msg);
                                });
                            }
                        });
                        var html = "";
                        for (i = 0 ; i < this.PeriodDetail.Days; i++) {
                            html = html + "<span></span>";
                        }
                        $(".line").html("").append(html);
                        $(".line span").each(function () {
                            $(this).css({ left: $(this).index() * (hrWidth / self.PeriodDetail.Days), width: (hrWidth / self.PeriodDetail.Days) })
                        })

                        //alert(1)
                        $("#fees").sortable({
                            revert: 300,
                            placeholder: "sortable-placeholder",
                        }).disableSelection();
                        $("#fees-tool li").draggable({
                            connectToSortable: "#fees",
                            cursor: "move",
                            revert: 300,
                            helper: "clone",
                            stop: function () {
                                //$(this).sortable( "refresh" );
                            }
                        }).disableSelection()

                    },
                    AllFees: function () {
        
                    }
                },
                methods: {
                    LoadPeriodsAndPaymentSequence: function (fnCallback) {
                        var self = this;
                        var callApi = new CallApi('TrustManagement', 'usp_StructureDesign_GetPeriods', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.ExecuteDataTable(function (response) {
                            self.Periods = response;
                            for (i = 0, length = self.Periods.length; i < length; i++) {
                                self.DaysArr[i] = self.computeDays(self.Periods[i].EndDate, self.Periods[i].StartDate)
                            }
                            if (fnCallback && typeof fnCallback === 'function') {
                                fnCallback();
                            }
                        });
                    },
                    LoadAllFees: function () {
                        var self = this;
                        var filePath = "E:\\TSSWCFServices\\TrustManagementService\\UITaskStudio\\Models\\ZhaoShang\\CashFlowFeeModel.Xml";
                        var serviceUrl = GlobalVariable.DataProcessServiceUrl + "/GetFeesFromXMLFile?FilePath=" + filePath;
                        $.ajax({
                            url: serviceUrl,
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            dataType: "jsonp",
                            crossDomain: true,
                            success: function (response) {
                                var jsonSource = jQuery.parseJSON(response);
                                self.AllFees = jsonSource.Json
                                self.AllFees_OptionSource = jsonSource.DataSources;
                            },
                            error: function (response) {
                                alert("error:" + response);
                            }
                        });
                    },
                    LoadAllEvents: function () {
                        var self = this;
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_GetAllEvent', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.ExecuteDataTable(function (response) {
                            self.AllEvents = response;
                            console.log(self.AllEvents)
                        });
                    },

                    computeDays: function (start, end) {
                        var offsetTime = Math.abs(new Date(end) - new Date(start));
                        return Math.floor(offsetTime / (3600 * 24 * 1e3));
                    },
                    ShowPeriodDetail: function (event, index, period) {
                        var $li = $(event.currentTarget);
                        $li.addClass('selected').siblings().removeClass('selected');
                        this.PeriodDetail.Index = index;
                        this.PeriodDetail.Start = period.StartDate;
                        this.PeriodDetail.End = period.EndDate;
                        this.PeriodDetail.Days = this.DaysArr[index];
                        var self = this;
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_GetPeriodDetail', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.AddParam({ Name: 'StartDate', Value: period.StartDate, DBType: 'date' });
                        callApi.AddParam({ Name: 'EndDate', Value: period.EndDate, DBType: 'date' });
                        callApi.ExecuteDataSet(function (response) {
                            if (!response || response.length < 1) { return; }
                            self.PeriodDetail.Dates = response[0];
                            self.PeriodDetail.Fees = response[1];
                            self.PeriodDetail.Events = response[2];
                            self.PeriodDetail.Scenarios = self.SortPaymentPlans(response[3]);
                        });
                    },
                    SortPaymentPlans: function (plans) {
                        for (var i = 0, length = plans.length; i < length; i++) {
                            var plan = plans[i];
                            plan.PaymentSequence = eval('(' + plan.PaymentSequence + ')');
                        }
                        return plans;
                    },
                    CalDateLeftOffset: function (date) {
                        var self = this;
                        var offesetdays = Math.floor((new Date(date) - new Date(this.PeriodDetail.Start)) / (3600 * 24 * 1e3));
                        return offesetdays / this.PeriodDetail.Days * this.PeriodTimeLineWidth - 12;
                    },
                    RemoveTrustCode: function (title) {
                        return title.replace(/\([^\)]*\)/g, "");
                    },
                    showDate: function (offsetLeft) {
                        var self = this;
                        var dir = Math.floor(new Date(self.PeriodDetail.End) - new Date(self.PeriodDetail.Start));
                        var d = ((offsetLeft + 12) / this.PeriodTimeLineWidth) * dir + new Date(self.PeriodDetail.Start).getTime()
                        return new Date(d).dateFormat("yyyy-MM-dd")
                    },

                    /**************费用信息**************/
                    ///当前期费用项的详细参数信息====> this.FeeDetail
                    GetExistedFeeDetail: function (periodEndDate, trustFeeName) {
                        var self = this;

                        //periodEndDate = '2016-01-25', trustFeeName = 'AssetService_Fee_2';
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_GetFeeDetail', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.AddParam({ Name: 'TranscationDate', Value: periodEndDate, DBType: 'date' });
                        callApi.AddParam({ Name: 'TrustFeeName', Value: trustFeeName, DBType: 'string' });
                        callApi.ExecuteDataTable(function (response) {
                            if (!response || !response.length) {
                                alert('费用信息加载失败！');
                                return;
                            }

                            var feeCodeName = trustFeeName.substring(0, trustFeeName.lastIndexOf('_'));
                            var feeActionCode = feeCodeName + '_#Id#';
                            var feeDefinition = $.grep(self.AllFees, function (fee) { return fee.ActionCode === feeActionCode });
                            feeDefinition = feeDefinition[0];
                            $.each(feeDefinition.Parameters, function (i, param) {
                                var paramCodeName = param.Name.substring(0, param.Name.lastIndexOf('_'));
                                var factParam = $.grep(response, function (fparam) {
                                    var fparamCode = fparam.ItemCode.substring(0, fparam.ItemCode.lastIndexOf('_'));
                                    return paramCodeName === fparamCode;
                                });
                                if (!factParam || !factParam.length) {
                                    return true;//continue
                                }

                                param.Name = factParam[0].ItemCode;
                                param.ItemValue = factParam[0].ItemValue;
                            });

                            self.FeeDetail = feeDefinition;
                        });
                    },
                    ///当前期费用项中移除费用信息
                    RemoveExistedFee: function (periodEndDate, trustFeeName) {
                        ////可能不用验证：当前期的费用理应都是存在于某一个偿付情境中，目前删除为临时做法
                        //var allLevelsFees = [];
                        //for (var i = 0, slength = this.PeriodDetail.Scenarios.length; i < slength; i++) {
                        //    var scenario = this.PeriodDetail.Scenarios[i];
                        //    $.each(scenario.PaymentSequence.Levels, function (s, level) {
                        //        $.each(level.BondFees, function (o, fee) {
                        //            allLevelsFees.push(fee.Name);
                        //        });                                 
                        //    });
                        //}
                        //if (allLevelsFees.indexOf(trustFeeName) > -1) {
                        //    alert('当前费用存在于偿付情景，暂时无法移除！');
                        //    return;
                        //}

                        ////periodEndDate = '2016-01-25', trustFeeName = 'AssetService_Fee_2';
                        if (!confirm('确认将移除该费用信息？')) { return; }
                        var self = this;
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_RemoveFee', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.AddParam({ Name: 'TranscationDate', Value: periodEndDate, DBType: 'date' });
                        callApi.AddParam({ Name: 'TrustFeeName', Value: trustFeeName, DBType: 'string' });
                        callApi.ExecuteNoQuery(function (response) {
                            var msg = '费用删除成功!';
                            if (response > 0) {
                                msg = '费用删除失败!';
                            }
                            alert(msg);
                        });
                    },
                    ///当前期费用信息中添加新的费用信息====> this.FeeDetail
                    AddNewFee_Get: function (periodEndDate, feeName) {
                        var self = this;

                        //periodEndDate = '2016-01-25', feeName = 'AssetService_Fee_#Id#';
                        var trustFeeName = feeName.substring(0, trustFeeName.lastIndexOf('_#') + 1);
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_GetFeeCount', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.AddParam({ Name: 'TranscationDate', Value: periodEndDate, DBType: 'date' });
                        callApi.AddParam({ Name: 'TrustFeeName', Value: trustFeeName, DBType: 'string' });
                        callApi.ExecuteDataTable(function (response) {
                            var currentIndex = parseInt(response[0].CurrentIndex) + 1;
                            alert(currentIndex);

                            var feeDefinition = $.grep(self.AllFees, function (fee) { return fee.ActionCode === feeName });
                            feeDefinition = feeDefinition[0];

                            feeDefinition.ActionCode = trustFeeName + currentIndex;
                            $.each(feeDefinition.Parameters, function (i, param) {
                                var paramCodeName = param.Name.substring(0, param.Name.lastIndexOf('_#') + 1);
                                param.Name = paramCodeName + currentIndex;
                            });

                            self.FeeDetail = feeDefinition;
                        });
                    },
                    ///保存往当前期费用信息中添加的新的费用信息
                    AddNewFee_Save: function () {
                        var self = this;
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_GetAllEvent', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.ExecuteDataTable(function (response) {
                            self.AllEvents = response;
                        });
                    },

                    /**************偿付情景**************/
                    ///更新偿付情景:偿付情境中添加、移除、排序费用信息时，需要更新整个偿付情景
                    UpdateScenario: function (scenarioIndex) {
                        var self = this;
                        var scenario = this.PeriodDetail[scenarioIndex];
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_UpdateScenario', true);
                        callApi.AddParam({ Name: 'TrustID', Value: self.TrustID, DBType: 'int' });
                        callApi.AddParam({ Name: 'ScenarioID', Value: scenario.ScenarioId, DBType: 'int' });
                        callApi.AddParam({ Name: 'PaymentSequence', Value: JSON.stringify(scenario), DBType: 'string' });
                        callApi.ExecuteNoQuery(function (response) {
                            var msg = '更新成功!';
                            if (response > 0) {
                                msg = '更新失败!';
                            }
                            alert(msg);
                        });
                    },

                    EventRemove: function (trustEventID) {
                        var self = this;
                        var callApi = new CallApi('TrustManagement', 'dbo.usp_StructureDesign_EventRemove', true);
                        callApi.AddParam({ Name: 'TrustEventID', Value: trustEventID, DBType: 'int' });
                        callApi.ExecuteDataTable(function (response) {
                            alert('删除成功');
                        });
                    },
                    editFees: function (argument) {
                        $("#dialog").dialog({
                              height: 300,
                              width: 350,
                              modal: true,
                              buttons: {
                                "确认"： function() {

                                },
                                "取消"： function () {
                                    $(this).dialog("close")
                                }
                              }
                          })
                    }
                },
                ready: function () {
                    var self = this;
                    var trustId = common.getQueryString('trustId');
                    if (!trustId || isNaN(trustId)) {
                        return;
                    }

                    this.TrustID = trustId;
                    this.LoadPeriodsAndPaymentSequence(function () {
                        self.LoadAllFees();
                        self.LoadAllEvents();
                    });
                    $(".tool-container .arrow").click(function () {
                        $(this).parent(".tool").toggleClass("slide");
                        console.log($(this).parent().hasClass("payment-plan-tool"))
                        if ($(this).parent().hasClass("slide")) {
                            $(this).parent().css({ left: "auto" })
                        }
                    })
                    $(".tool-container .tool").draggable({ handle: "h3", cursor: "move" });

                }
            });
        });
});
