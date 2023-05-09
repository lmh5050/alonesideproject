 //Event Start 
	//<script type="text/javascript">		
		class CommonFunc {
			sessionStorage = null;
			contents_ready = null;
			
			createMultiPartForm() {
				return new FormData();
			}
			
			constructor(_sessionStorage) {
				// 클래스 내 변수 선언
				this.sessionStorage = sessionStorage;
			}
			
			makeArgs(_key, _value) {
				var args = "&" + _key + "=" + _value;

				return args;
			}
			
			postArgs(_target, _args) {
				var result;
				$.ajax({
					type	: "POST",
					url		: _target,
					data	: _args,
					async	: false,
					success	: function(data) {
						if( data != null ) {
							result = data;
						}
					}
				});

				return result;
			}
			
			postForm(_target, _args) {
				var result;
				$.ajax({
					type	: "POST",
					url		: _target,
					data	: _args,
					contentType : false,
					processData : false,
					async	: false,
					success	: function(data) {
						if( data != null ) {
							result = data;
						}
					}
				});

				return result;
			}
			
			postMultiPart(_target, _form_data) {
				var result;
				$.ajax({
					type	: "POST",
					url		: _target,
					data	: _form_data,
					contentType : false,
					processData : false,
					async	: false,
					success	: function(data) {
						if( data != null ) {
							result = data;
						}
					}
				});
				return result;
			}
			
			getArgs(_target, _args) {
				var result;
				$.ajax({
					type	: "GET",
					url		: _target,
					data	: _args,
					async	: false,
					success	: function(data) {
						if( data != null ) {
							result = data;
						}
					}
				});

				return result;
			}
			
			// 컨텐츠 변경 ()
			changeContents2(_abs_module_name) {
				
			}
			
			// 컨텐츠 변경 (사용안함)
			// ex : 변경 값에 데이터를 전달할 경우
			//      전달한 화면에서 CUSTOM_SEND_DATA 변수를 통해 데이터를 사용한다.
			// commonFunc.changeContents(abs_module_name, executeContentReadyFunc, "test");
			changeContents(_abs_module_name, _func = null, _module_params = null ) {
				var param_args		 = this.makeArgs("contents", _abs_module_name);
				
				// 화면에 전달 데이터 추가
				if( _module_params != null )
					param_args			+= this.makeArgs("send_data", _module_params);
				else
					param_args			+= this.makeArgs("send_data", "");
				
				var result = this.postArgs("/main_contents", param_args);
				this.setCurrentPageName(_abs_module_name, "ospis");
				this.removeChildren($(".content-wrapper"));

				$(".content-wrapper").append(result);
				
				if( _func != null)
				_func();
			}
			
			getCurrentPageName(_variable_name) {
				console.log("최초 정보 가져옴");
				var return_val = this.sessionStorage.getItem(_variable_name);
				console.log(return_val);
				if( return_val == null || return_val == undefined ) {
					console.log("없다");
					return_val = "@";
				}
				return return_val;
			}
			
			// 선택한 컨텐츠 하위 정보 삭제
			removeChildren(_element) {
				// 선택한 객체 하위 태그 삭제
				$(_element).children().remove();

				// 선택한 객체 하위 주석 삭제
				$(_element).empty();
			}
			
			// 브라우저 변수 설정
			// page_info -> kaqg : main , ospis : main 서로 각자 분류되므로 필요할 때 불러와야 함
			setCurrentPageName(_page_info, _page_type) {
				console.log("페이지인포 들어옴 : " + _page_info + " , " + _page_type);
				var page_info = this.getCurrentPageName('current_page');
				if( page_info != null && page_info != undefined ) {
					var tmp_page_info = page_info.split("@");
					if( _page_type == "ospis" ) {
						tmp_page_info[1] = _page_info;
					}
					else if( _page_type == "kaqg" ) {
						tmp_page_info[0] = _page_info;
					}
					
					console.log(tmp_page_info.join("@"));
					page_info = tmp_page_info.join("@");
				}
				else {
					page_info = "@";
				}
				console.log("페이지 인포 저장");
				console.log(page_info);
				this.sessionStorage.setItem('current_page', page_info);
			}

			async postFetch(url, datas) {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(datas)
				});
				return response.json();
			}
			
			
		}
		
		// class 객체 선언
		var commonFunc = new CommonFunc(sessionStorage);
	//</script>
	// Event End 