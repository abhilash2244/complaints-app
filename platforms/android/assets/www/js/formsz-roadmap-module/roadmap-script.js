var app = angular.module('formsz-roadMap',[])


app.service('calculatonFrmulaExcecutorService',[function(){
	var rs ={};
	
    //global functions
    /**
     * @description validating the formula
     * @param {objcet,objcet,object}
     * @developer venkatesh bendi
    */
	rs.formulaValidatore = function(formulaObjcet,recordInfoData,$scope)
    {		

    		var isEmptyValues = false;
    		angular.forEach(formulaObjcet,function(formulaFields,operatoretype){
				if(operatoretype == "singleOperator")
				{		
					var processFormula = simplifyFildelistFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
						$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "numeric")
				{		
					var processFormula = simplifynumericTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
						$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "add")
				{
					var processFormula = simplyfyAddTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
						$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "sub")
				{		
					var processFormula = simplyfySubTypeFormula(formulaFields,recordInfoData)
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "mul")
				{		
					var processFormula = simplyfyMulTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "div")
				{		
					var processFormula = simplyfyDivTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "avg")
				{		
					var processFormula = simplyfyAvgTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "sqrt")
				{		
					var processFormula = simplyfySqrtTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "inv")
				{		
					var processFormula = simplyfyInverseTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "(")
				{	

					var sts = paraFormulaValidatore(formulaFields.fieldList,formulaFields.operator,recordInfoData,$scope);

					if(sts[0])
					{
						isEmptyValues = true;
					}
					else
					{
							$scope.formulaSimplifier = $scope.formulaSimplifier + sts[1]+""+sts[2];	
					}
					
				}
			})
    	return isEmptyValues;
    }
    
    /**
     * @description check calculatuon field execute with correct values or not
     * @param {objcet,objcet,object}
     * @developer venkatesh bendi
    */
    rs.isCalculationsFieldsAreStoresValidValues = function(recordInfoData,invalidCalculationsFieldList,$scope)
	{
			angular.forEach($scope.calculationFieldsList,function(objcet,index){
					if(recordInfoData[objcet.id]!= undefined && recordInfoData[objcet.id] != "")
					{
							formulaExecutionSave(objcet.id,objcet.formula,recordInfoData,invalidCalculationsFieldList,$scope);
					}
					else
					{

					}
			})
	}

	//local functions
	 /**
     * @description execyte the formula while save or submiting the form
     * @param {objcet,objcet,object}
     * @developer venkatesh bendi
    */
	function formulaExecutionSave(id,formula,recordInfoData,invalidCalculationsFieldList,$scope)
	{	
	
		$scope.formulaSimplifier ="";
		var isEmptyValues =false;
	
		angular.forEach(formula,function(formulaObjcet,index){
			isEmptyValues = rs.formulaValidatore(formulaObjcet,recordInfoData,$scope)
	
		})
		
		if(!isEmptyValues)
		{

				recordInfoData[id] = math.eval($scope.formulaSimplifier);
		}

		else
		{
				invalidCalculationsFieldList.push(id);
		}
		
	}

	/**
     * @description validate and execute the login with para brackets
     * @param {objcet,string,objcet,objcet} 
     * @developer venkatesh bendi
    */
    function paraFormulaValidatore(formulaObjcet,mainOperatore,recordInfoData,$scope)
    {		var isEmptyValues = false;
    	    var formulaPara="";
    	    angular.forEach(formulaObjcet,function(arrayObjcets,index)
    	    {
    	    	angular.forEach(arrayObjcets,function(formulaFields,operatoretype){
				if(operatoretype == "singleOperator")
				{		
					var processFormula = simplifyFildelistFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
						formulaPara = formulaPara + processFormula;
				}
				else if(operatoretype == "numeric")
				{		
					var processFormula = simplifynumericTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
						formulaPara = formulaPara + processFormula;
				}
				else if(operatoretype == "add")
				{
					var processFormula = simplyfyAddTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
						formulaPara = formulaPara + processFormula;
				}
				else if(operatoretype == "sqrt")
				{		
					var processFormula = simplyfySqrtTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "inv")
				{		
					var processFormula = simplyfyInverseTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							$scope.formulaSimplifier = $scope.formulaSimplifier + processFormula;
				}
				else if(operatoretype == "sub")
				{		
					var processFormula = simplyfySubTypeFormula(formulaFields,recordInfoData)
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							formulaPara = formulaPara + processFormula;
				}
				else if(operatoretype == "mul")
				{		
					var processFormula = simplyfyMulTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							formulaPara = formulaPara + processFormula;
				}
				else if(operatoretype == "div")
				{		
					var processFormula = simplyfyDivTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							formulaPara = formulaPara + processFormula;
				}
				else if(operatoretype == "avg")
				{
					var processFormula = simplyfyAvgTypeFormula(formulaFields,recordInfoData);
					if(processFormula == 'invalid')
							isEmptyValues = true;
					else
							formulaPara = formulaPara + processFormula;
				}
				
			})
    	})
    		

		var paraCalCount = math.eval(formulaPara)
		return [isEmptyValues,paraCalCount,mainOperatore];
    }

	/**
     * @description validate and execute single parameter
     * @param {objcet,objcet} 
     * @developer venkatesh bendi
    */
	function simplifyFildelistFormula(formulaFields,recordInfodata)
	{ 
		var formulaDef="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{
			if(recordInfodata[objcet.id] == undefined || recordInfodata[objcet.id] == "")
			{
				emptyFieldsCount++;
			}
			else
				formulaDef = formulaDef+""+recordInfodata[objcet.id];
			//$scope.formulaSimplifier = $scope.formulaSimplifier+""+$scope.recordInfo[objcet.id];
		})
		
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
				return formulaDef;

	}
	/**
     * @description validate and execute numeric fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplifynumericTypeFormula(formulaFields,recordInfoData)
	{ 
		var formulaDef="";
		formulaDef = formulaFields.fieldList+""+formulaFields.operator;
		
		return formulaDef;

	}
	function simplyfyAddTypeFormula(formulaFields,recordInfoData)
	{	
		var totalValue =0;
		var formulaDef="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{
			if(recordInfoData[objcet.id] == undefined ||recordInfoData[objcet.id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				totalValue = totalValue+parseInt(recordInfoData[objcet.id]);
			}
		})
		formulaDef = formulaDef+""+totalValue;
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return formulaDef;
		
	}

	/**
     * @description validate and execute avg fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplyfyAvgTypeFormula(formulaFields,recordInfoData)
	{	
		var totalValue =0;
		var formulaDef="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{
			if(recordInfoData[objcet.id] == undefined || recordInfoData[objcet.id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				totalValue = totalValue+parseInt(recordInfoData[objcet.id]);
			}
		})
        var findAvg =  totalValue/formulaFields.fieldList.length;
   		formulaDef = formulaDef+""+totalValue;
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return findAvg;
		
	}
	/**
     * @description validate and execute sub fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplyfySubTypeFormula(formulaFields,recordInfoData)
	{	
		var subFormula = "";
		var formulaDef ="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{	if(recordInfoData[objcet.id] == undefined || recordInfoData[objcet.id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				if(formulaFields.fieldList.length-1 > index){
						subFormula = subFormula+recordInfoData[objcet.id]+"-";
				}	
				else
				{
					subFormula = subFormula+recordInfoData[objcet.id]
				}
			}
				
		})
		formulaDef = formulaDef+""+math.eval(subFormula);
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return formulaDef;
	}

	/**
     * @description validate and execute Sqrt fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplyfySqrtTypeFormula(formulaFields,recordInfoData)
	{	
		var subFormula = "";
		var formulaDef ="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{	if(recordInfoData[objcet.id] == undefined || recordInfoData[objcet.id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{	
				subFormula = recordInfoData[objcet.id]
				
			}
				
		})
		
		formulaDef = formulaDef+""+math.sqrt(subFormula);
		formulaDef = formulaDef+""+formulaFields.operator;
		
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return formulaDef;
	}

	/**
     * @description validate and execute mul fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplyfyMulTypeFormula(formulaFields,recordInfoData)
	{	
		var subFormula = "";
		var formulaDef ="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{	if(recordInfoData[objcet.id] == undefined || recordInfoData[objcet.id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				if(formulaFields.fieldList.length-1 > index){
						subFormula = subFormula+""+parseInt(recordInfoData[objcet.id])+"*";
				}	
				else
				{
					subFormula = subFormula+""+parseInt(recordInfoData[objcet.id]);
				}
			}
				
		})
		formulaDef = formulaDef+""+math.eval(subFormula);
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return formulaDef;
	}

	/**
     * @description validate and execute div fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplyfyDivTypeFormula(formulaFields,recordInfoData)
	{	
		var subFormula = "";
		var formulaDef ="";
		var emptyFieldsCount =0;
		angular.forEach(formulaFields.fieldList,function(objcet,index)
		{	if(recordInfoData[objcet.id] == undefined || recordInfoData[objcet.id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				if(formulaFields.fieldList.length-1 > index){
						subFormula = subFormula+""+parseInt(recordInfoData[objcet.id])+"/";
				}	
				else
				{
					subFormula = subFormula+""+parseInt(recordInfoData[objcet.id]);
				}
			}
				
		})

		formulaDef = formulaDef+""+math.eval(subFormula);
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return formulaDef;
	}

	/**
     * @description validate and execute inverse fields
     * @param {objcet,objcet}
     * @developer venkatesh bendi
    */
	function simplyfyInverseTypeFormula(formulaFields,recordInfoData)
	{	
		var subFormula = "";
		var formulaDef ="";
		var emptyFieldsCount =0;
		if(formulaFields.fieldList.length == 1)
		{
			if(recordInfoData[formulaFields.fieldList[0].id] == undefined || recordInfoData[formulaFields.fieldList[0].id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				subFormula =1 +"/"+parseInt(recordInfoData[formulaFields.fieldList[0].id]);
			}
		}
		else if(formulaFields.fieldList.length == 2)
		{
			if(recordInfoData[formulaFields.fieldList[0].id] == undefined || recordInfoData[formulaFields.fieldList[0].id] == "")
			{
					emptyFieldsCount++;
			}
			else
			{
				subFormula =parseInt(recordInfoData[formulaFields.fieldList[1].id]) +"/"+parseInt(recordInfoData[formulaFields.fieldList[0].id]);
			}
		}
		else
		{
			emptyFieldsCount++;
		}

		
		formulaDef = formulaDef+""+math.eval(subFormula);
		formulaDef = formulaDef+""+formulaFields.operator;
		if(emptyFieldsCount>0)
			return "invalid"
		else
			return formulaDef;
	}

	return rs;
}])

app.service('projectTaskServices',['$rootScope','commonService','strings','$http','$ionicModal','setGetObj','$ionicPopover','loginService','$localstorage','alertService','$ionicPopup','config','$state','$ionicSideMenuDelegate','$ionicScrollDelegate','$location' ,function($rootScope,commonService,strings,$http,$ionicModal,setGetObj,$ionicPopover,loginService,$localstorage,alertService,$ionicPopup,config,$state,$ionicSideMenuDelegate,$ionicScrollDelegate,$location){
	var projecttaskServices ={};
	projecttaskServices.startSpeech = function($scope){
		startSpeech($scope);
	}


	function fillSelectedIndiWidgetField($scope){
		if($scope.fields[$scope.voiceRecogIncrement].readOnly != true){
			setInputField($scope,$scope.fields[$scope.voiceRecogIncrement].lable, $scope.fields[$scope.voiceRecogIncrement].id,true,"individual",$scope.fields[$scope.voiceRecogIncrement].type);
		} 
		else{
		    $scope.voiceRecogIncrement++;
			startSpeech($scope);
		}
	}

	function fillSelectedGroupOrSectionWidgetField($scope,value,incrementInnerLoop,type){
		switch (value[$scope.voiceRecogIncrementForGroupOrSection].type.view) {
            case 'textbox' :
				if(value[$scope.voiceRecogIncrementForGroupOrSection].readOnly != true){
					setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].lable,value[$scope.voiceRecogIncrementForGroupOrSection].id,incrementInnerLoop,type,value[$scope.voiceRecogIncrementForGroupOrSection].type);
				}else{
				    $scope.voiceRecogIncrementForGroupOrSection++;
					startSpeech($scope);
				}
                break;
            case 'textarea' :
				if(value[$scope.voiceRecogIncrementForGroupOrSection].readOnly != true){
					setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].lable,value[$scope.voiceRecogIncrementForGroupOrSection].id,incrementInnerLoop,type,value[$scope.voiceRecogIncrementForGroupOrSection].type);
				}else{
				    $scope.voiceRecogIncrementForGroupOrSection++;
					startSpeech($scope);
				}
            	break;
            case 'select' :
				setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].lable,value[$scope.voiceRecogIncrementForGroupOrSection].id,incrementInnerLoop,type,value[$scope.voiceRecogIncrementForGroupOrSection].type);
            	break;
        	default:
	            $scope.voiceRecogIncrement++;
				startSpeech($scope);
            	break;
        }
	}

	function fillSelectedGroupInSectionWidgetField($scope,value,incrementInnerLoop,type){
		switch (value[$scope.voiceRecogIncrementForGroupInSection].type.view) {
            case 'textbox' :
				if(value[$scope.voiceRecogIncrementForGroupInSection].readOnly != true){
					setInputField($scope,value[$scope.voiceRecogIncrementForGroupInSection].lable,value[$scope.voiceRecogIncrementForGroupInSection].id,incrementInnerLoop,type,value[$scope.voiceRecogIncrementForGroupInSection].type);
				}else{
				    $scope.voiceRecogIncrementForGroupInSection++;
					startSpeech($scope);
				}
                break;
            case 'textarea' :
				if(value[$scope.voiceRecogIncrementForGroupInSection].readOnly != true){
					setInputField($scope,value[$scope.voiceRecogIncrementForGroupInSection].lable,value[$scope.voiceRecogIncrementForGroupInSection].id,incrementInnerLoop,type,value[$scope.voiceRecogIncrementForGroupInSection].type);
				}else{
				    $scope.voiceRecogIncrementForGroupInSection++;
					startSpeech($scope);
				}
            	break;
            case 'select' :
				setInputField($scope,value[$scope.voiceRecogIncrementForGroupInSection].lable,value[$scope.voiceRecogIncrementForGroupInSection].id,incrementInnerLoop,type,value[$scope.voiceRecogIncrementForGroupInSection].type);
            	break;
        	default:
	            $scope.voiceRecogIncrement++;
				startSpeech($scope);
            	break;
        }
	}

	function startSpeech($scope){
		if($scope.voiceRecogIncrement < $scope.fields.length && !$scope.stopVoiceRecong){
			switch ($scope.fields[$scope.voiceRecogIncrement].type.view) {
	            case 'textbox' :
	            	fillSelectedIndiWidgetField($scope);
	                break;
	            case 'textarea' :
	            	fillSelectedIndiWidgetField($scope);
	            	break;
	            case 'select' :
	            	fillSelectedIndiWidgetField($scope);
	            	break;
	            case 'group' :
					var value =  $scope.fields[$scope.voiceRecogIncrement].type.fields;
					if($scope.voiceRecogIncrementForGroupOrSection == value.length-1){
						fillSelectedGroupOrSectionWidgetField($scope,value,true,"group");
					}else if($scope.voiceRecogIncrementForGroupOrSection < value.length){
						fillSelectedGroupOrSectionWidgetField($scope,value,false,"group");
					}
            		break;
	            case 'section' :
					var value =  $scope.fields[$scope.voiceRecogIncrement].type.fields;
					if($scope.voiceRecogIncrementForGroupOrSection == value.length-1){
						if(value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "select" || (value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "textbox" && value[$scope.voiceRecogIncrementForGroupOrSection].data.readOnly != true)){
							setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].data.lable,value[$scope.voiceRecogIncrementForGroupOrSection].data.id,true,"section",value[$scope.voiceRecogIncrementForGroupOrSection].data.type);
						}
						else if(value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "group"){
							val = value[$scope.voiceRecogIncrementForGroupOrSection].data.type.fields;
							if($scope.voiceRecogIncrementForGroupInSection == val.length-1){
								fillSelectedGroupInSectionWidgetField($scope,val,true,"groupsInSection");
							}else if($scope.voiceRecogIncrementForGroupInSection < val.length){
								fillSelectedGroupInSectionWidgetField($scope,val,false,"groupsInSection");
							}
						}	
					}else if($scope.voiceRecogIncrementForGroupOrSection < value.length){
						if(value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "select" || (value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "textbox" && value[$scope.voiceRecogIncrementForGroupOrSection].data.readOnly != true)){
							setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].data.lable,value[$scope.voiceRecogIncrementForGroupOrSection].data.id,false,"section",value[$scope.voiceRecogIncrementForGroupOrSection].data.type);
						}
						else if(value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "group"){
							val = value[$scope.voiceRecogIncrementForGroupOrSection].data.type.fields;
							if($scope.voiceRecogIncrementForGroupInSection == val.length-1){
								fillSelectedGroupInSectionWidgetField($scope,val,true,"groupsInSection");
							}else if($scope.voiceRecogIncrementForGroupInSection < val.length){
								fillSelectedGroupInSectionWidgetField($scope,val,false,"groupsInSection");
							}
						}	
					}
	            	break;
	            default:
		            $scope.voiceRecogIncrement++;
					startSpeech($scope);
	            	break;
	        }
    	}
    	else{
			$scope.voiceSearchToggle.value = false; 
    	}
	}

	function setInputField($scope,lable,id,isDoIncrement,type,data){
		scrollToSpecifiedFieldByID(id);
		setRecognisedField($scope,lable,id,isDoIncrement,type,data);
	}
	function scrollToSpecifiedFieldByID(id){
		$location.hash(id);      
	    $ionicScrollDelegate.anchorScroll(); 
	}
	function setRecognisedField($scope,lable,id,increment,type,data){
			TTS.speak({
	           text: "Please speak the text for the field called "+lable,
	           locale: 'en-IN',
	           rate: 1
	       }, function () {
	       		recogniseAndSet($scope,lable,id,increment,type,data);
	       }, function (reason) {
	           // Handle the error case
	       });
	}
	function setWidgetFieldWithVoiceEntry($scope,result,data,type,increment,id){
		switch (data.view) {
            case 'textbox' :
            	$scope.selectedFormRecordFields[id] = result;
		        incrementValue($scope,type,increment);
                break;
            case 'textarea' :
            	fillSelectedIndiWidgetField($scope);
            	break;
            case 'select' :
            	if(result == "skip"){
            		incrementValue($scope,type,increment);
				}else{
	            	var pos = data.values.map(function(e) { return e.lable; }).indexOf(result);
			    	if(pos != -1){
				        $scope.selectedFormRecordFields[id] = data.values[pos].value;
			        	incrementValue($scope,type,increment);
				    }
				    else{
			            startSpeech($scope);
				    }
				}
            	break;
            default:
	            $scope.voiceRecogIncrement++;
				startSpeech($scope);
            	break;
	    }
	}
	function incrementValue($scope,type,increment){
        if(type == "groupsInSection" && increment == true){
            $scope.voiceRecogIncrementForGroupInSection = 0;
            $scope.voiceRecogIncrementForGroupOrSection++;
            startSpeech($scope);
        }else if(type == "groupsInSection" && increment == false){
            $scope.voiceRecogIncrementForGroupInSection++;
            startSpeech($scope);
        }else if(type == "section" && increment == true){
            $scope.voiceRecogIncrementForGroupOrSection = 0;
            $scope.voiceRecogIncrement++;
            startSpeech($scope);
        }else if(type == "section" && increment == false){
            $scope.voiceRecogIncrementForGroupOrSection++;
            $scope.voiceRecogIncrementForGroupInSection = 0;
            startSpeech($scope);
        }else if(type == "group" && increment == true){
            $scope.voiceRecogIncrementForGroupOrSection = 0;
            $scope.voiceRecogIncrement++;
            startSpeech($scope);
        }else if(type == "group" && increment == false){
            $scope.voiceRecogIncrementForGroupOrSection++;
            startSpeech($scope);
        }if(type == "individual"){
            $scope.voiceRecogIncrement++;
            startSpeech($scope);
        }
	}
	function recogniseAndSet($scope,lable,id,increment,type,data){
		var recognition = new SpeechRecognition();
	    recognition.onresult = function(event) {
	        if (event.results.length > 0) {
	        	setWidgetFieldWithVoiceEntry($scope,event.results[0][0].transcript,data,type,increment,id);
	            $scope.$apply();

	        }else{
	            startSpeech($scope);
	        }
	    };
	    recognition.onerror = function(event) {
	            startSpeech($scope);
	    };

	    recognition.onend = function(event) {
			recognition.stop();
	    };

	    recognition.start();
       // Do Something after success
	}

	return projecttaskServices;
}])

app.service('mapComponentServices',['$rootScope','commonService','strings','$http','$ionicModal','setGetObj','$ionicPopover','loginService','$localstorage','alertService','$ionicPopup','config','$state','$ionicSideMenuDelegate','$ionicScrollDelegate','$location' ,function($rootScope,commonService,strings,$http,$ionicModal,setGetObj,$ionicPopover,loginService,$localstorage,alertService,$ionicPopup,config,$state,$ionicSideMenuDelegate,$ionicScrollDelegate,$location){
	var mapInServices ={};

    /**
     * @desc 
        For getting the suggesions of asset search
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.searchData = function($scope,selected){
    	if(selected == ""){
            $scope.suggestions = [];
	    }
	    else{
	        var params = {
	            term: selected.toLowerCase(),
	            limit: 10
	        };
	        return $http.get(
	            'https://myworld.tatapower.com/myworld/mcs_search?&application=standard', {
	                params: params
	            }
	        ).then(function(response) {
	            $scope.suggestions = response.data.suggestions;
	        });

	    }
	}
    /**
     * @desc 
        Highlighting asset search in map from suggestions list 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.gotoSelection = function($scope,value){
		        $scope.objects = [];
		        value = value.data.id;
		        var val = value.split(":");
		        var params = {
		            tablename: val[0],
		            id: val[1]
		        };
		        console.log(params)
		        return $http.get(
		            ' https://myworld.tatapower.com/myworld/mcs_feature_info', {
		                params: params
		            }
		        ).then(function(response) {
		            var bbox = response.data.bbox;
		            $rootScope.map.fitBounds([
		                [bbox[1], bbox[0]],
		                [bbox[3], bbox[2]]
		            ]);

		            
		            var objectprop = response.data.properties;
		            var objectgeo = response.data.geometry;
		            $scope.geojsonFeature = {
		                "type": "Feature",
		                "properties": objectprop,
		                "geometry": objectgeo
		            };
		            clearMap($scope);
		            highlightingFeatures($scope.geojsonFeature,$scope);
		        });
	}
    /**
     * @desc 
        Configuring network layers in map 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.layerConfiguration = function($scope){
		$scope.accessibleLayers = $localstorage.getObject("assignedLayers").assignedLayers;
		$http.get($scope.baseUrl+"system/layerlists", {
			headers : {
				'Content-Type' : "application/json"
			}
		})
		.success(function (res) {
			$scope.listOfLayers = res.res;
			angular.forEach(res.res, function (value, key) {
				$scope.tilelayer = new L.TileLayer($scope.baseUrl + "tile/geo/"+res.res[key].spec+"/" + "{z}/{x}/{y}.png?" + Math.round(Math.random() * 1000000), {maxZoom:21});
				angular.forEach($scope.accessibleLayers, function(value1, key1) {
				        if(value.name == value1.name){
				        	$scope.layerControl.addOverlay($scope.tilelayer, res.res[key].name);
							$scope.tilelayer.addTo($rootScope.map);
				        }
				});
			});
		});
		$scope.osmBaseLayer.addTo($rootScope.map);
	}
    /**
     * @desc 
        Getting existing bookmarks 
     * @author Santhosh Kumar Gunti
 	*/

    mapInServices.showBookmarks = function($scope){
		if(!$scope.bookmarkCheck.value){
	    	$scope.measureToolCheck.value = false; 
	    	$scope.routeBetween2PointsCheck.value = false; 
	    	$scope.bufferSearchCheck.value = false;
	    	$scope.bookmarkCheck.value = false;
	    	$scope.homeViewCheck.value = false;
	    	getBookmarks($scope,true);
	    	clearMeasureTool($scope);
	    	clearRouteBetween2PointsTool($scope);
	    	clearBufferSearchTool($scope);
	    	clearHomeViewTool($scope);
		}
		else{
			clearBookmarkTool($scope);
		}
		$scope.bookmarkCheck.value = !$scope.bookmarkCheck.value;
	}
	
	function clearHomeViewTool($scope){
    	$scope.homeViewCheck.value = false;
	}

	function clearBookmarkTool($scope){
    	$scope.bookmarkCheck.value = false;
	}
    /**
     * @desc 
        Showing route between two point point which is given by user by placing points on map 
     * @author Santhosh Kumar Gunti
 	*/
    mapInServices.showRoute = function($scope){
    	if($scope.source == undefined || $scope.source == ""){
    		alertService.showToast("Please choose source location by clicking on map");
    	}else if($scope.destination == undefined || $scope.source == ""){
    		alertService.showToast("Please choose destination location by clicking on map");
    	}else
    	{
	        var route = '';
	        route = 'http://maps.google.com/maps?saddr=Current+Location&';
	        var sAddress = $scope.source;
	        var dAddress = $scope.destination;
			var url = 'http://maps.google.com/maps?saddr='+sAddress+'&daddr='+dAddress;
			window.open(url, "_system", 'location=yes');	    
		}
	}

	mapInServices.goToReferences = function(url){
		if (!url.match(/^https?:\/\//i)) {
    	    url = 'http://' + url;
	    }
		window.open(url, '_system', 'location=yes');
	}
    /**
     * @desc 
        Deleting bookmark by name 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.deleteBookmark = function($scope,bookmarkName){
		var url = config.url+"/api/v1/bookmarks/deleteBookmark/"+bookmarkName;
		loginService.deleteBookmark(url, securityHeaders, function (response) {
			if (response.status == 200) {
				alertService.showToast(response.message);
				getBookmarks($scope,false);
			} else {
				alertService.doAlert(response.message);
			}
		});
	}

    /**
     * @desc 
        Getting existing bookmarks 
     * @author Santhosh Kumar Gunti
 	*/

	function getBookmarks($scope, isFirstTimeShow){
		var url = config.url+"/api/v1/bookmarks/getBookmarks/"+$localstorage.getObject("username");
		loginService.getBookmarks(url, securityHeaders, function (response) {
			console.log(response);
			if (response.status == 200) {
				$scope.showBookMarks = [];
				$scope.showBookMarks = response.data;
				if(isFirstTimeShow)
					show($scope);
			} else {
				alertService.showToast(response);
			}
		});
	}

	mapInServices.toggleSearchType = function($scope){
		$ionicPopover.fromTemplateUrl('templates/elipsePopoverForToggleSearchType.html', {
			scope : $scope
		}).then(function (popover) {
			$scope.elipsePopoverForSearchType = popover;
			openelipsePopoverForSearchType($scope);
		});
	}

	mapInServices.toggleToAddress = function($scope){
		$scope.searchedItem = "Address";
		closeelipsePopoverForSearchType($scope);
	}

	mapInServices.toggleToAsset = function($scope){
		$scope.searchedItem = "Asset";
		closeelipsePopoverForSearchType($scope);
	}

	function openelipsePopoverForSearchType($scope){
		$scope.elipsePopoverForSearchType.show();
	}
	function closeelipsePopoverForSearchType($scope){
		$scope.elipsePopoverForSearchType.hide();
	}
	/**
     * @desc 
        Showong popup for Editing bookmark
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.editBookmark = function($scope,oldBookmarkName){
		$scope.oldBookmarkName = oldBookmarkName;
		$scope.editBookmarkName = oldBookmarkName;
		$ionicPopover.fromTemplateUrl('templates/editBookmark.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalCloseEditBookmark = modal;
			$scope.modalCloseEditBookmark.show();
		});
	}

	/**
     * @desc 
        Editing bookmark by its name 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.updateBookmark = function($scope,newBookmarkName){
		if(newBookmarkName != undefined && newBookmarkName.trim() != ""){
			var url = config.url+"/api/v1/bookmarks/editBookmark/"+$scope.oldBookmarkName+"/"+newBookmarkName;
			loginService.editBookmark(url, securityHeaders, function (response) {
				console.log(response);
				if (response.status == 200) {
					alertService.showToast(response.message);
					$scope.modalCloseEditBookmark.hide();
					getBookmarks($scope, false);
				} else {
					alertService.showToast(response.message);
				}
			});
		}else{
			alertService.showToast("please enter the valid name");
		}
	}

	/**
     * @desc 
        Toggling buffer search on and off 
     * @author Santhosh Kumar Gunti
 	*/

    mapInServices.toggleBUfferSearch = function($scope){
		if(!$scope.bufferSearchCheck.value){
	    	$scope.measureToolCheck.value = false; 
	    	$scope.routeBetween2PointsCheck.value = false; 
	    	$scope.bufferSearchCheck.value = false;
	    	$scope.bookmarkCheck.value = false;
	    	$scope.homeViewCheck.value = false;
	    	clearMeasureTool($scope);
	    	clearRouteBetween2PointsTool($scope);
	    	clearBufferSearchTool($scope);
	    	clearHomeViewTool($scope);
			}
			else{
				clearBufferSearchTool($scope);
			}
			$scope.bufferSearchCheck.value = !$scope.bufferSearchCheck.value;
	};
	/**
     * @desc 
        Creating bookmark 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.createBookmark = function($scope,bookmarkName){
		if(bookmarkName != undefined && bookmarkName.trim() != ""){
			var url = config.url+"/api/v1/bookmarks/addBookmark";
			var data = {};
			data.bookmarkName = bookmarkName;
			data.northEast = $rootScope.map.getBounds()._northEast;
			data.southWest = $rootScope.map.getBounds()._southWest;
			data.zoomLevel = $rootScope.map.getZoom();
			data.username = $localstorage.getObject("username");

			loginService.addBookmark(url, data, securityHeaders, function (response) {
				console.log(response);
				if (response.status == 200) {
					alertService.showToast(response.message);
					$scope.modalCloseAddBookmark.hide();
					getBookmarks($scope,false);
				} else {
					alertService.showToast(response.message);
				}
			});
		}else{
			alertService.showToast("please enter the valid name");
		}
	}
	

	/**
	 * Params {JSON Object}
     * @desc 
        For setting the map interaction field values which was selected on map 
     * @modified by Santhosh Kumar Gunti
 	*/
	mapInServices.setMapInteractionFieldValue = function($scope,data,selectedFeatureData){
//		var selectedFeatureData = commonService.getCurrentSelectedFeature();
		if(selectedFeatureData != undefined){
			if ("data" in data){
				$scope.selectedFormRecordFields[data.data.id] = selectedFeatureData;
			}else{
				$scope.selectedFormRecordFields[data.id] = selectedFeatureData;
			}
		}
		else{
			openMenu();
//			alertService.doAlert('Please copy the attribute value in map by selecting feature');
		}
	}

	/**
	 * Params {JSON Object}
     * @desc 
        Goto field, when user click on icon of goto field in form, it takes user to the location of feature of giveninput   
     * @modified by Santhosh Kumar Gunti
 	*/
	mapInServices.gotoField = function($scope,fieldDetails){

		if(fieldDetails != undefined && fieldDetails.trim() != ""){
	    	commonService.LoaderShow();
			var params = {
	            term: fieldDetails.toLowerCase(),
	            limit: 10
	        };
			
			$http.get(
	            'https://myworld.tatapower.com/myworld/mcs_search?&application=standard', {
	                params: params
	            }
	        ).then(function(response) {
	        	console.log(response);
	        	if(response.data.suggestions.length > 1){
		        	commonService.Loaderhide();
	        		alertService.showToast("Multiple features found");
	        	}else if(response.data.suggestions.length == 0){
		        	commonService.Loaderhide();
	        		alertService.showToast("No features found");
	        	}
	        	else{
					var params = {
			            tablename: response.data.suggestions[0].data.id.split(":")[0],
			            id: response.data.suggestions[0].data.id.split(":")[1]
			        };
					$http.get(
			            'https://myworld.tatapower.com/myworld/mcs_feature_info', {
			                params: params
			            }
			        ).then(function(response) {
						openMenu();
			        	commonService.Loaderhide();
				        setFeature(response.data,$scope);

						zoomToCurrentBBox(response.data.bbox);

			        },function(response){
			        	commonService.Loaderhide();
			        	alert("error");
			        });
	        	}
	        },function(response){
	        	commonService.Loaderhide();
	        	alert("error");
	        });
	    }
	    else{
	    	alertService.showToast("Please provide input for this field");
	    }
	}
    /**
     * @desc 
        For toggleing side menu 
     * @author Santhosh Kumar Gunti
 	*/

  	function openMenu(){
		$ionicSideMenuDelegate.toggleRight();
  	}

    /**
     * @desc 
        Enabling point geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/

	function pointGeometry($scope){
		$scope.isPointDrawModeActivated == true;
		removeSketching($scope);
 
        drawingTools($scope);
        $scope.interactionHandler = new L.Draw.Marker($rootScope.map, $scope.options.options.create.marker);
        $scope.interactionHandler.enable();

	}

    /**
     * @desc 
        Enabling line geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/
	function lineGeometry($scope){
		$scope.isLineDrawModeActivated == true;
		removeSketching($scope);
        drawingTools($scope);
        $scope.interactionHandler = new L.Draw.Polyline($rootScope.map, $scope.options.options.create.polyline);
        $scope.interactionHandler.enable();
	}

    /**
     * @desc 
        Enabling area geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/
	function areaGeometry($scope){
		$scope.isAreaDrawModeActivated == true;
 		removeSketching($scope);
        drawingTools($scope);
        $scope.interactionHandler = new L.Draw.Polygon($rootScope.map, $scope.options.options.create.polygon);
        $scope.interactionHandler.enable();
	}

    /**
     * @desc 
        Switching on and off point geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/

    mapInServices.togglePointGeometryCheck = function($scope){
		if($scope.interactionHandler)
			$scope.interactionHandler.disable();

    	if(!$scope.isDrawModeActivated){
			if(!$scope.pointGeometryCheck.value){
		    	$scope.lineGeometryCheck.value = false; 
		    	$scope.areaGeometryCheck.value = false; 
		    	$scope.pointGeometryCheck.value = false;
		    	pointGeometry($scope);
				}
				else{
			 		removeSketching($scope);
				}
				$scope.pointGeometryCheck.value = !$scope.pointGeometryCheck.value;
		}
		else{
			alertService.doAlert("please complete the point drawing by tapping on map");
		}
	};

    /**
     * @desc 
        Switching on and off line geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/
    mapInServices.toggleLineGeometryCheck = function($scope){
		if($scope.interactionHandler)
			$scope.interactionHandler.disable();

    	if(!$scope.isDrawModeActivated){
			if(!$scope.lineGeometryCheck.value){
		    	$scope.areaGeometryCheck.value = false; 
		    	$scope.pointGeometryCheck.value = false; 
		    	$scope.lineGeometryCheck.value = false;
		    	lineGeometry($scope)
				}
				else{
			 		removeSketching($scope);
				}
				$scope.lineGeometryCheck.value = !$scope.lineGeometryCheck.value;
		}
		else{
			alertService.doAlert("please complete the line drawing by cliking on last point");
		}
	};
    /**
     * @desc 
        Switching on and off area geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/

    mapInServices.toggleAreaGeometryCheck = function($scope){
		if($scope.interactionHandler)
			$scope.interactionHandler.disable();

    	if(!$scope.isDrawModeActivated){
			if(!$scope.areaGeometryCheck.value){
		    	$scope.lineGeometryCheck.value = false; 
		    	$scope.pointGeometryCheck.value = false; 
		    	$scope.areaGeometryCheck.value = false;
		    	areaGeometry($scope);
				}
				else{
			 		removeSketching($scope);
				}
				$scope.areaGeometryCheck.value = !$scope.areaGeometryCheck.value;
		}
		else{
			alertService.doAlert("please complete the area drawing by clicking on first point");
		}

	};
    /**
     * @desc 
        Switching on and off annotation geometry to draw point on map for sketching  
     * @author Santhosh Kumar Gunti
 	*/


	mapInServices.openModalForAnnotationSketching = function($scope) {
		openModalForAnnotationSketching($scope);
	}

	mapInServices.closeModalForAnnotationSketching = function($scope) {
		closeModalForAnnotationSketching($scope);
	}

	function closeModalForAnnotationSketching($scope) {
		$scope.modalForAnnotationSketching.hide();
	}

	function openModalForAnnotationSketching($scope) {
		$scope.modalForAnnotationSketching.show();
	}

	mapInServices.annotationGeometry = function($scope){
		if($rootScope.drawnItems.toGeoJSON().features.length < 1){
			alertService.doAlert("Please draw the geometry first");			
		}
		else{
			$ionicPopover.fromTemplateUrl('templates/popoverForAnnotationSketching.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modalForAnnotationSketching = modal;
				openModalForAnnotationSketching($scope);
			});

/*			var promptPopup = $ionicPopup.prompt({
				subTitle : 'Add notes',
	         	inputType: 'text',
	         	placeholder : 'write notes for sketching'
	      	});
	        
		    promptPopup.then(function(data) {
		    	if(data != NaN && data != undefined){
		    		setAnnotation($scope,data);
				}
				else{
				}
		    });*/

		}
	}
    /**
     * @desc 
        setting annotation to the selected drawn geometry  
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.setAnnotation = function($scope,data){

		var lat,lng;
		if($rootScope.drawnItems.toGeoJSON().features[0].geometry.type == "Point"){
			lat = $rootScope.drawnItems.toGeoJSON().features[0].geometry.coordinates[0];
			lng = $rootScope.drawnItems.toGeoJSON().features[0].geometry.coordinates[1];
		}else if ($rootScope.drawnItems.toGeoJSON().features[0].geometry.type == "Polygon"){
			lat = $rootScope.drawnItems.toGeoJSON().features[0].geometry.coordinates[0][0][0];
			lng = $rootScope.drawnItems.toGeoJSON().features[0].geometry.coordinates[0][0][1];
		}else{
			lat = $rootScope.drawnItems.toGeoJSON().features[0].geometry.coordinates[0][0];
			lng = $rootScope.drawnItems.toGeoJSON().features[0].geometry.coordinates[0][1];
		}
    	var blueIcon = L.icon({
		    iconUrl: 'img/infoR.png',
		    iconAnchor:   [15, 30],
		    iconSize:     [30, 30],
		    popupAnchor:  [0, -20]
		});
 	
		$scope.sketchingDescription = {"lat":lat,"lng":lng,"description":data};

        if($scope.geometryAnnotationPoint){
			$scope.geometryAnnotationPoint.bindPopup(data).openPopup();
        }else{
			$scope.geometryAnnotationPoint = new L.marker([lng,lat], {icon: blueIcon}).addTo($rootScope.map).bindPopup(data).openPopup();
        }

		closeModalForAnnotationSketching($scope);
	}
    /**
     * @desc 
        Undo last point of geometry while drawing line or area geometry, this will not applicable for point geometry  
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.undoGeometry = function($scope){
        var lastMarker = $scope.interactionHandler._markers.pop(),
        	poly = $scope.interactionHandler._poly,
			// Replaces .spliceLatLngs()
			latlngs = poly.getLatLngs(),
			latlng = latlngs.splice(-1, 1)[0];
		$scope.interactionHandler._poly.setLatLngs(latlngs);

		$scope.interactionHandler._markerGroup.removeLayer(lastMarker);

		if (poly.getLatLngs().length < 2) {
			$rootScope.map.removeLayer(poly);
		}
		$scope.interactionHandler._vertexChanged(latlng, false);

	}

    /**
     * @desc 
        Editing the existing sketching  
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.editSketching = function($scope,sketchingData,isHistory){
		if(!isHistory){
			openMenu();
			$scope.typeOfSketching = "edit";
			removeSketching($scope);
			drawingTools($scope);
			closeModalOfSketchings($scope);
			commonService.setSketchingNameInEditMode(sketchingData.name);
			
			$rootScope.$broadcast('enableSketchingForEdit');

	    	var blueIcon = L.icon({
			    iconUrl: 'img/infoR.png',
			    iconAnchor:   [15, 30],
			    iconSize:     [30, 30],
			    popupAnchor:  [0, -20]
			});

	        if($scope.geometryAnnotationPoint){
	    		$scope.geometryAnnotationPoint.bindPopup(data).openPopup();
	        }else if(sketchingData.sketchingDescription != undefined){
	       		$scope.geometryAnnotationPoint = new L.marker([sketchingData.sketchingDescription.lng,sketchingData.sketchingDescription.lat], {icon: blueIcon}).addTo($rootScope.map).bindPopup(sketchingData.sketchingDescription.description).openPopup();
	        }

	        if(sketchingData.coordinates.geometry.type  === "Point")
	        {     
	            new L.GeoJSON(sketchingData.coordinates, {
	                pointToLayer: function (feature, latlng) {
	                            try{
	                                var editMarkerIcon = new L.DivIcon({iconSize: new L.Point(20, 20), className: 'leaflet-div-icon'});
	                                editOverlay = new L.Marker(latlng, editMarkerIcon);
	                                editOverlay.setIcon(editMarkerIcon);
	                                $rootScope.drawnItems.addLayer(editOverlay);
	                                $scope.interactionHandler = new L.EditToolbar.Edit($rootScope.map, {
	                                        featureGroup: $rootScope.drawnItems,
	                                        selectedPathOptions: $scope.options.options.edit.selectedPathOptions
	                                });
	                                $rootScope.map.addLayer($rootScope.drawnItems);
	                                $scope.interactionHandler.enable();
	                            }
	                            catch(err)
	                            {
	                                //console.log(err);
	                                console.log(JSON.stringify(err));
	                            }
	                                
	                             }
	            });
	        }
	        else{
	           $scope.editGeomGeoJsonObjectLayer = new L.GeoJSON(sketchingData.coordinates, {
	                style: {weight: 5, opacity: 1, clickable: false}
	              }).addTo($rootScope.map);
	               $scope.editGeomGeoJsonObjectLayer.eachLayer(function (layer) {
	                $rootScope.drawnItems.addLayer(layer);
	                layer.editing.enable();
	                layer.setStyle({color: 'DarkRed'});
	                var polygon = new L.GeoJSON(sketchingData.coordinates);
	                $rootScope.map.fitBounds(polygon.getBounds());
	            });
	       }
	     }else{
	     	$scope.imgSrc = sketchingData.screenshot;
			$ionicPopover.fromTemplateUrl('templates/sketchingPreview.html', {
						scope: $scope
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
			});
	     }
	}
    /**
     * @desc 
        deleting the sketching   
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.deleteSketching = function($scope,$index){
		deleteSketching($scope,$index);
	}

    /**
     * @desc 
        deleting the sketching   
     * @author Santhosh Kumar Gunti
 	*/
	function deleteSketching($scope,$index){
		if ($rootScope.isGridRecodsShow == false) {
			$scope.recordInfo['sketching'].splice($index,1);     
		}else{
			$scope.selectedFormRecordFields['sketching'].splice($index,1);     
		}
	}
    /**
     * @desc 
        Saving the sketching to the respective form   
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.openModalForSaveSketching = function($scope) {
		openModalForSaveSketching($scope);
	}

	mapInServices.closeModalForSaveSketching = function($scope) {
		closeModalForSaveSketching($scope);
	}

	function closeModalForSaveSketching($scope) {
		$scope.modalForSaveSketching.hide();
	}

	function openModalForSaveSketching($scope) {
		$scope.modalForSaveSketching.show();
	}

	mapInServices.saveGeometry = function($scope,data){
		if(data != "" && data != undefined){
	        var sketching;
	        $rootScope.drawnItems.eachLayer(function (layer) {
	            sketching = layer.toGeoJSON();
	            if(sketching.geometry.type != "Point")
					layer.editing.disable();
	        });

		  	var sketchingData = {
                    type: sketching.type,
                    coordinates: sketching,
                    screenshot: $scope.sketchingScreenshot,
                    sketchingDescription : $scope.sketchingDescription,
                    name: data
            };
            
            if($scope.typeOfSketching == "add"){
	            if(setSketchingData(sketchingData)){
	            	alertService.doAlert("Sketching with specified name is exists, please provide other name");
	            }else{
		            onCreationsuccess($scope);
		        }
            }else if($scope.typeOfSketching == "edit"){
		            updateSketchingData(sketchingData,commonService.getSketchingNameInEditMode());
		            onCreationsuccess($scope);
	        }

		}
		else{
			alertService.doAlert("please provide the sketching name");
		}

	}

	function setSketchingData(data){
		var isExists = false; 
		angular.forEach($rootScope.sketchingData,function(val,index){
			if(val.name == data.name){
				isExists = true;
			}
		})
		if(isExists){
			return true;
		}else{
			$rootScope.sketchingData.push(data);
			
			if($rootScope.sketchingFrom == "projectTask"){
			    $rootScope.$broadcast('setSketchingDataInProjectTask');
//				$scope.selectedFormRecordFields['sketching'] = $rootScope.sketchingData;
			}else if($rootScope.sketchingFrom == "Task"){
			    $rootScope.$broadcast('setSketchingDataInTask');
			}
			return false;				
		}
	}

	mapInServices.resetSketchingData = function(){
		$rootScope.sketchingData = [];
	}

	function updateSketchingData(currentSketching,previousSketchingName){
		angular.forEach($rootScope.sketchingData,function(val,index){
			if(val.name == previousSketchingName){
				$rootScope.sketchingData[index] = currentSketching;
					if($rootScope.sketchingFrom == "projectTask"){
					    $rootScope.$broadcast('setSketchingDataInProjectTask');
					}else if($rootScope.sketchingFrom == "Task"){
					    $rootScope.$broadcast('setSketchingDataInTask');
					}
				}
		})
	}

	function onCreationsuccess($scope)
	{
        alertService.showToast("Sketching added successfully");
	    $rootScope.$broadcast('disableSketching');
        openMenu();
    	$scope.lineGeometryCheck.value = false; 
    	$scope.areaGeometryCheck.value = false; 
    	$scope.pointGeometryCheck.value = false;
    	closeModalForSaveSketching($scope);
	}
	mapInServices.popoverForSaveGeometry = function($scope){
		if($rootScope.drawnItems.toGeoJSON().features.length < 1){
			alertService.doAlert("Geometry drawing is not yet completed. For line geometry click on last point to end, for area geometry click on first point to end");			
		}
		else{

		navigator.screenshot.URI(function(error,res){
			$scope.sketchingScreenshot = res.URI;
		  if(error){
		    console.error(error);
		  }else{
			$scope.sketchingName = commonService.getSketchingNameInEditMode();
			console.log(commonService.getSketchingNameInEditMode());
			$ionicPopover.fromTemplateUrl('templates/popoverForSaveSketching.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modalForSaveSketching = modal;
				openModalForSaveSketching($scope);
			});
			  }
			});
		}
	}    

    /**
     * @desc 
        options to draw sketching   
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.drawingTools = function($scope){
		drawingTools($scope);
	}

	mapInServices.drawingTools = function($scope){
		drawingTools($scope);
	}

	mapInServices.startSpeech = function($scope){
		startSpeech($scope);
	}

	function fillSelectedWidgetField($scope){
		if($scope.fields[$scope.voiceRecogIncrement].readOnly != true){
			setInputField($scope,$scope.fields[$scope.voiceRecogIncrement].lable, $scope.fields[$scope.voiceRecogIncrement].id,true,"individual");
		} 
		else{
		    $scope.voiceRecogIncrement++;
			startSpeech($scope);
		}
	}

	function startSpeech($scope){
		if($scope.voiceRecogIncrement < $scope.fields.length && !$scope.stopVoiceRecong){
			switch ($scope.fields[$scope.voiceRecogIncrement].type.view) {
	            case 'textbox' :
	            	fillSelectedWidgetField($scope);
	                break;
	            case 'textarea' :
					if($scope.fields[$scope.voiceRecogIncrement].readOnly != true){
						setInputField($scope,$scope.fields[$scope.voiceRecogIncrement].lable, $scope.fields[$scope.voiceRecogIncrement].id,true,"individual");
					}
					else{
			            $scope.voiceRecogIncrement++;
						startSpeech($scope);
					}
	            	break;
	            case 'group' :
					var value =  $scope.fields[$scope.voiceRecogIncrement].type.fields;
					if($scope.voiceRecogIncrementForGroupOrSection == value.length-1){
						if((value[$scope.voiceRecogIncrementForGroupOrSection].type.view == "textbox" && value[$scope.voiceRecogIncrementForGroupOrSection].readOnly != true)){
							setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].lable,value[$scope.voiceRecogIncrementForGroupOrSection].id,true,"group");
						}
					}else if($scope.voiceRecogIncrementForGroupOrSection < value.length){
						if((value[$scope.voiceRecogIncrementForGroupOrSection].type.view == "textbox" && value[$scope.voiceRecogIncrementForGroupOrSection].readOnly != true)){
							setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].lable,value[$scope.voiceRecogIncrementForGroupOrSection].id,false,"group");
						}
					}
            		break;
	            case 'section' :
					var value =  $scope.fields[$scope.voiceRecogIncrement].type.fields;
					if($scope.voiceRecogIncrementForGroupOrSection == value.length-1){
						if((value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "textbox" && value[$scope.voiceRecogIncrementForGroupOrSection].data.readOnly != true)){
							setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].data.lable,value[$scope.voiceRecogIncrementForGroupOrSection].data.id,true,"section");
						}
						else if(value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "group"){
							val = value[$scope.voiceRecogIncrementForGroupOrSection].data.type.fields;
							if($scope.voiceRecogIncrementForGroupInSection == val.length-1){
								if((val[$scope.voiceRecogIncrementForGroupInSection].type.view == "textbox" && val[$scope.voiceRecogIncrementForGroupInSection].readOnly != true)){
									setInputField($scope,val[$scope.voiceRecogIncrementForGroupInSection].lable, val[$scope.voiceRecogIncrementForGroupInSection].id,true,"groupsInSection");
								}
							}else if($scope.voiceRecogIncrementForGroupInSection < val.length){
								if((val[$scope.voiceRecogIncrementForGroupInSection].type.view == "textbox" && val[$scope.voiceRecogIncrementForGroupInSection].readOnly != true)){
									setInputField($scope,val[$scope.voiceRecogIncrementForGroupInSection].lable, val[$scope.voiceRecogIncrementForGroupInSection].id,false,"groupsInSection");
								}
							}
						}	
					}else if($scope.voiceRecogIncrementForGroupOrSection < value.length){
						if((value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "textbox" && value[$scope.voiceRecogIncrementForGroupOrSection].data.readOnly != true)){
							setInputField($scope,value[$scope.voiceRecogIncrementForGroupOrSection].data.lable,value[$scope.voiceRecogIncrementForGroupOrSection].data.id,false,"section");
						}
						else if(value[$scope.voiceRecogIncrementForGroupOrSection].data.type.view == "group"){
							val = value[$scope.voiceRecogIncrementForGroupOrSection].data.type.fields;
							if($scope.voiceRecogIncrementForGroupInSection == val.length-1){
								if((val[$scope.voiceRecogIncrementForGroupInSection].type.view == "textbox" && val[$scope.voiceRecogIncrementForGroupInSection].readOnly != true)){
									setInputField($scope,val[$scope.voiceRecogIncrementForGroupInSection].lable, val[$scope.voiceRecogIncrementForGroupInSection].id,true,"groupsInSection");
								}
							}else if($scope.voiceRecogIncrementForGroupInSection < val.length){
								if((val[$scope.voiceRecogIncrementForGroupInSection].type.view == "textbox" && val[$scope.voiceRecogIncrementForGroupInSection].readOnly != true)){
									setInputField($scope,val[$scope.voiceRecogIncrementForGroupInSection].lable, val[$scope.voiceRecogIncrementForGroupInSection].id,false,"groupsInSection");
								}
							}
						}	
					}

	            	break;
	            default:
		            $scope.voiceRecogIncrement++;
					startSpeech($scope);
	            	break;
	        }
    	}else{
			$scope.voiceSearchToggle.value = true;
    	}
	}

	function setInputField($scope,lable,id,isDoIncrement,type){
		scrollToSpecifiedFieldByID(id);
		setRecognisedField($scope,lable,id,isDoIncrement,type);
	}
	function scrollToSpecifiedFieldByID(id){
		$location.hash(id);      
	    $ionicScrollDelegate.anchorScroll(); 
	}
	function setRecognisedField($scope,lable,id,increment,type){
			TTS.speak({
	           text: "Please speak the text for the field called "+lable,
	           locale: 'en-IN',
	           rate: 1
	       }, function () {
	       		recogniseAndSet($scope,lable,id,increment,type);
	       }, function (reason) {
	           // Handle the error case
	       });
	}
	function recogniseAndSet($scope,lable,id,increment,type){
		var recognition = new SpeechRecognition();
	    recognition.onresult = function(event) {
	        if (event.results.length > 0) {

				if ($rootScope.isGridRecodsShow == false) {
		            $scope.recordInfo[id] = event.results[0][0].transcript;
				}else{
		            $scope.selectedFormRecordFields[id] = event.results[0][0].transcript;
				}

	            $scope.$apply();

	            if(type == "groupsInSection" && increment == true){
		            $scope.voiceRecogIncrementForGroupInSection = 0;
		            $scope.voiceRecogIncrementForGroupOrSection++;
		            startSpeech($scope);
	            }else if(type == "groupsInSection" && increment == false){
		            $scope.voiceRecogIncrementForGroupInSection++;
		            startSpeech($scope);
	            }else if(type == "section" && increment == true){
		            $scope.voiceRecogIncrementForGroupOrSection = 0;
		            $scope.voiceRecogIncrement++;
		            startSpeech($scope);
	            }else if(type == "section" && increment == false){
		            $scope.voiceRecogIncrementForGroupOrSection++;
		            $scope.voiceRecogIncrementForGroupInSection = 0;
		            startSpeech($scope);
	            }else if(type == "group" && increment == true){
		            $scope.voiceRecogIncrementForGroupOrSection = 0;
		            $scope.voiceRecogIncrement++;
		            startSpeech($scope);
	            }else if(type == "group" && increment == false){
		            $scope.voiceRecogIncrementForGroupOrSection++;
		            startSpeech($scope);
	            }if(type == "individual"){
		            $scope.voiceRecogIncrement++;
		            startSpeech($scope);
	            }
	        }else{
	            startSpeech($scope);
	        }
	    };
	    recognition.onerror = function(event) {
	            startSpeech($scope);
	    };

	    recognition.onend = function(event) {
			recognition.stop();
	    };

	    recognition.start();
       // Do Something after success
	}


    /**
     * @desc 
        triggers of sketching like on creation and on editing of geometry on map   
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.drawingController = function($scope){
		drawingController($scope);
	}

    /**
     * @desc 
        options to draw sketching   
     * @author Santhosh Kumar Gunti
 	*/
    function drawingTools($scope){
            drawingController($scope);
            $scope.options =  {options: {
            create: {
                polygon : {
                    metric :true,
                    //showArea: true,

                    allowIntersection: false, // Restricts shapes to simple polygons
                    drawError: {
                        color: '#e1e100',
                        message: '<strong>Oh snap!<strong> you can\'t draw that!',
                    },
                    shapeOptions: {
                        color: 'blue'
                    }
                },
                polyline: {
                    metric: true,
                    showArea:false,
                    shapeOptions: {
                        color: 'blue'
                    }
                },

                marker : {
                    icon: new L.DivIcon({
                            iconSize: new L.Point(20, 20),
                             className: 'leaflet-div-icon'
                        }),
                    shapeOptions: {
                        color: 'blue',
                        fill: true
                    }
                }
            },
            edit: {
                featureGroup: null,
                selectedPathOptions :  {
                    color: 'blue', 
                    opacity: 0.6,
                    weight: 4,
                    fill: true,
                    fillColor: 'blue',
                    fillOpacity: 0.1
                }
            }
        }};
        
        }
    /**
     * @desc 
        triggers of sketching like on creation and on editing of geometry on map   
     * @author Santhosh Kumar Gunti
 	*/
    function drawingController($scope){
                $rootScope.map.on('draw:created', function (e) {
                	$scope.isDrawModeActivated = false;
                    var type = e.layerType;
                    $scope.currentDrawLayer = e.layer;
                    $rootScope.drawnItems.addLayer($scope.currentDrawLayer);
                    $scope.interactionHandler = new L.EditToolbar.Edit($rootScope.map, {
                    	featureGroup: $rootScope.drawnItems,
                        selectedPathOptions: $scope.options.options.edit.selectedPathOptions
                    });
                    $rootScope.map.addLayer($rootScope.drawnItems);
                });
                
                
                $rootScope.map.on('draw:edited', function (e) {
                    
                    var layers = e.layers;
                    layers.eachLayer(function(layer) {

                    });
                    
              	});

	            $rootScope.map.on('draw:drawstart', function (e) {
	            	$scope.isDrawModeActivated = false;
  	                var layers = e.layers;
                });

	            $rootScope.map.on('draw:drawend', function (e) {
	            	$scope.isDrawModeActivated = false;
  	                var layers = e.layers;
                });

        }

    /**
     * @desc 
        Clearing measure tool
     * @author Santhosh Kumar Gunti
 	*/
	function clearMeasureTool($scope){
    	if ($scope.customControl) {
                $rootScope.map.removeControl($scope.customControl);
                $scope.customControl = null;
            }

            if ($scope.lthMarkers.length != 0) {
                for (var i = 0; i < $scope.lthMarkers.length; i++) {
                    $rootScope.map.removeLayer($scope.lthMarkers[i]);
                }
                $scope.lthMarkers = [];
                $scope.totalDistance = 0;

                $scope.coord = [];
            }
            if ($scope.polylines.length != 0) {
                for (var i = 0; i < $scope.polylines.length; i++) {
                    $rootScope.map.removeLayer($scope.polylines[i]);
                }
                $scope.polylines = [];
            }
    }
    function clearRouteBetween2PointsTool($scope){

    }
    /**
     * @desc 
        Clearing buffer search tool
     * @author Santhosh Kumar Gunti
 	*/
    function clearBufferSearchTool($scope){
  			removeBufferDistanceCircle($scope);
	    	removeBufferDistanceCnterMarker($scope);
    }
    /**
     * @desc 
        Removing buffer search circle from map
     * @author Santhosh Kumar Gunti
 	*/
    function removeBufferDistanceCircle($scope){
    	if($rootScope.map.hasLayer($scope.bufferDistanceCircle))
			$rootScope.map.removeLayer($scope.bufferDistanceCircle); // remove
    }
    /**
     * @desc 
        Removing buffer search marker from map
     * @author Santhosh Kumar Gunti
 	*/
	function removeBufferDistanceCnterMarker($scope){
		if($rootScope.map.hasLayer($scope.bufferDistanceCenterMarker))
			$rootScope.map.removeLayer($scope.bufferDistanceCenterMarker); // remove
	}

    /**
     * @desc 
        Modal to show routeBetween2Points functionality
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.routeBetween2PointsTool = function($scope){
    	if(!$scope.routeBetween2PointsCheck.value){
	    	$scope.measureToolCheck.value = false; 
	    	$scope.routeBetween2PointsCheck.value = false; 
	    	$scope.bufferSearchCheck.value = false;
	    	$scope.bookmarkCheck.value = false;
	    	$scope.homeViewCheck.value = false;
	    	clearMeasureTool($scope);
	    	clearRouteBetween2PointsTool($scope);
	    	clearBufferSearchTool($scope);
	    	clearHomeViewTool($scope);

			$ionicModal.fromTemplateUrl('templates/routeBetween2PointsTool.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modalRouteBetween2Points = modal;
				$scope.modalRouteBetween2Points.show();
			});

  		}
  		else{
            clearRouteBetween2PointsTool($scope);
  		}
  		$scope.routeBetween2PointsCheck.value = !$scope.routeBetween2PointsCheck.value;

    }
	/**
     * @desc 
        Toggling measure tool on and off 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.measureTool = function($scope){
    	if(!$scope.measureToolCheck.value){
	    	$scope.measureToolCheck.value = false; 
	    	$scope.routeBetween2PointsCheck.value = false; 
	    	$scope.bufferSearchCheck.value = false;
	    	$scope.bookmarkCheck.value = false;
	    	$scope.homeViewCheck.value = false;
	    	clearBufferSearchTool($scope);
	    	clearRouteBetween2PointsTool($scope);
            createControlForMeasureTool($scope);
  		}
  		else{
            clearMeasureTool($scope);
  		}
  		$scope.measureToolCheck.value = !$scope.measureToolCheck.value;

    }
    /**
     * @desc 
        Zoom to the bookmark on click of bookmarks list 
     * @author Santhosh Kumar Gunti
 	*/
    mapInServices.zoomToBookmark = function($scope,bookmarkName){
		angular.forEach($scope.showBookMarks, function (value, key) {
			if(value.bookmarkName == bookmarkName){
				$rootScope.map.fitBounds([
				    value.northEast,
				    value.southWest
				]);
			}
		});
    }

    /**
     * @desc 
        Creating control for showing measure tools like area and length 
     * @author Santhosh Kumar Gunti
 	*/
    function createControlForMeasureTool($scope){
        $scope.customControl = L.control({
            position: 'bottomleft'
        });

        $scope.customControl.onAdd = function(map) {
            var container = L.DomUtil.create('div');
            container.backgroundSize = "17px 17px";
            container.width = '150px';
            container.height = '80px';
            container.type = "button";
            container.borderRadius = "18px";
            container.style.backgroundColor = "#307FE2";
            container.style.color = "#ffffff";
            container.style.marginLeft = "80px";
//		            container.style.marginTop = "18px";
//		            container.style.position = "fixed";
            container.value = $scope.totalDistance;
            container.innerHTML = "Measure tool enabled";
//   					container.position = "fixed";
            /* container.onclick = function() {   
             }*/
            return container;
        }
        $scope.customControl.addTo($rootScope.map)

    }
    function createControlForSketchingTool($scope){
        $scope.customControlForSketchingTool = L.control({
            position: 'topleft'
        });

        $scope.customControlForSketchingTool.onAdd = function(map) {
            var container = L.DomUtil.create('div');
            container.backgroundSize = "17px 17px";
            container.width = '150px';
            container.height = '80px';
            container.type = "button";
            container.borderRadius = "18px";
            container.style.backgroundColor = "#307FE2";
            container.style.color = "#ffffff";
            container.style.marginLeft = "80px";
            container.style.marginTop = "-65px";
//		            container.style.marginTop = "18px";
//		            container.style.position = "fixed";
            container.innerHTML  = '<div style="background-color:#307FE2;padding:10px;">'+
	            '<div style="display:flex">'+
				    '<button> Save</button>'+
				    '<button>Cancel</button>'+
				'</div>'+
			'</div>';
//   					container.position = "fixed";
            /* container.onclick = function() {   
             }*/
            return container;
        }
        $scope.customControlForSketchingTool.addTo($rootScope.map)

    }
    /**
     * @desc 
       	Popup for showing bookmark 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.showBookmark = function($scope){
		if($scope.modalCloseAddBookmark != undefined && $scope.modalCloseAddBookmark._isShown){
		}else{
			$ionicPopover.fromTemplateUrl('templates/addBookmark.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modalCloseAddBookmark = modal;
				$scope.modalCloseAddBookmark.show();
			});

		}
	}

	/**
     * @desc 
        click event for showing home view 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.gotoHomeView = function($scope){
		if(!$scope.homeViewCheck.value){
	    	$scope.measureToolCheck.value = false; 
	    	$scope.routeBetween2PointsCheck.value = false; 
	    	$scope.bufferSearchCheck.value = false;
	    	$scope.bookmarkCheck.value = false;
	    	$scope.homeViewCheck.value = false;

			$rootScope.map.setView([19.1190,72.8470], 10);

	    	clearMeasureTool($scope);
	    	clearRouteBetween2PointsTool($scope);
	    	clearBufferSearchTool($scope);
	    	clearHomeViewTool($scope);
		}
		else{

/*			clearBufferSearchTool($scope);
*/		}
		$scope.homeViewCheck.value = !$scope.homeViewCheck.value;
	}

	/**
     * @desc 
        click event for closing popup 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.closePopup = function($scope){
		$scope.modalFeatureSelection.hide();
		clearMap($scope);
	}

	/**
     * @desc 
        click event for closing show bookmark modal 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.closeShowBookmark = function($scope){
		$scope.modalCloseShowBookmark.hide();
		clearBookmarkTool($scope);
	}

	/**
     * @desc 
        click event for closing add bookmark modal 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.closeAddBookmark = function($scope){
		$scope.modalCloseAddBookmark.hide();
	}

	/**
     * @desc 
        click event for closing edit bookmark modal 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.closeEditBookmark = function($scope){
		$scope.modalCloseEditBookmark.hide();
	}
	/**
     * @desc 
        storing the selected attribute value to the comman service variable and this will be pasted to the any map interaction field in the form   
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.copySelectedField = function($scope){
		if($scope.selectedData.data != undefined){
//			commonService.setCurrentSelectedFeature($scope.selectedData.data);
			if($rootScope.typeOfTask == "Task"){
				$rootScope.$broadcast('fillMapInteractionInTaskForm', { fieldValue: $scope.selectedData.data });
			}
			else{
				$rootScope.$broadcast('fillMapInteractionInProjectTaskForm', { fieldValue: $scope.selectedData.data });
			}
			alertService.showToast("Selected field is copied");
		}
		else{
			alertService.showToast("Please select the field, then do copy");
		}
	}

	/**
     * @desc 
        Popup for showing work instructions of the form 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.workInstructions = function($scope,data){
		closeellipsePopoverInForms($scope);
		
		if(data == undefined){
			$scope.workInstruction = undefined;
		}
		else{
			$scope.workInstruction = data.split("\n");
		}
		$ionicPopover.fromTemplateUrl('templates/workInstructionPopover.html', {
					scope: $scope
				}).then(function (modal) {
					$scope.modal = modal;
					openModal($scope);
		});

	}
	/**
     * @desc 
        click event for closing modal 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.closeModal = function($scope) {
		$scope.modal.hide();
	};
	/**
     * @desc 
        click event for opening modal 
     * @author Santhosh Kumar Gunti
 	*/

	function openModal($scope){
		$scope.modal.show();
	}

	/**
     * @desc 
        Modal to show the created sketchings
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.sketchingsTask = function($scope){
		$rootScope.sketchingFrom = "Task";
		$ionicPopover.fromTemplateUrl('templates/modalForSketchingsTask.html', {
					scope: $scope
				}).then(function (modal) {
					$scope.modalForSketchings = modal;
					openModalOfSketchings($scope);

		});
	}

	mapInServices.sketchingsProjectTask = function($scope){
		$rootScope.sketchingFrom = "projectTask";
//		closeellipsePopoverInForms($scope);
		$ionicPopover.fromTemplateUrl('templates/modalForSketchingsProjectTask.html', {
					scope: $scope
				}).then(function (modal) {
					$scope.modalForSketchings = modal;
					openModalOfSketchings($scope);
		});
	}
	/**
     * @desc 
        Modal to show the form level references which have been given in portal while creating form 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.references = function($scope,data){
		closeellipsePopoverInForms($scope);

		if(data == undefined){
			$scope.reference = undefined;
		}
		else{
			$scope.reference = data.split(",");
		}
		$ionicPopover.fromTemplateUrl('templates/modalForReferences.html', {
					scope: $scope
				}).then(function (modal) {
					$scope.modalForReferences = modal;
					openModalOfReferences($scope);
		});
	}
	/**
     * @desc 
        click event for closing sketching modal 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.closeModalOfSketchings = function($scope) {
		closeModalOfSketchings($scope);
	}
	/**
     * @desc 
        click event for closing reference modal 
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.closeModalOfReferences = function($scope) {
		closeModalOfReferences($scope);
	}

	/**
     * @desc 
        event for removing sketching from map
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.removeSketching = function($scope) {
		removeSketching($scope);
	}

	/**
     * @desc 
        removing sketching from map
     * @author Santhosh Kumar Gunti
 	*/
	function removeSketching($scope){
		if($rootScope.drawnItems){
	        $rootScope.map.removeLayer($rootScope.drawnItems);
	        $rootScope.drawnItems.clearLayers();
        }
		if($scope.editGeomGeoJsonObjectLayer){
	        $scope.map.removeLayer($scope.editGeomGeoJsonObjectLayer);
	        $scope.editGeomGeoJsonObjectLayer.clearLayers();
        }
        if($scope.editPointFeatureGroup){
	        $scope.map.removeLayer($scope.editPointFeatureGroup);
	        $scope.editPointFeatureGroup.clearLayers();
        }
        if($scope.geometryAnnotationPoint){
	        $rootScope.map.removeLayer($scope.geometryAnnotationPoint);
	        $scope.geometryAnnotationPoint = null;
        }
	} 
	/**
     * @desc 
        Method fired, on click of add sketching from sketching popup in form and it takes you to the map to draw the sketching on map
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.addSketching = function($scope) {
		removeSketching($scope);		
		closeModalOfSketchings($scope);
		commonService.setSketchingStatus(true);
		commonService.setSketchingNameInEditMode("");
		$rootScope.geojson = [];
		$rootScope.$broadcast('enableSketchingForAdd');
	}

	/**
     * @desc 
        opening elipses in form
     * @author Santhosh Kumar Gunti
 	*/

	mapInServices.openellipsePopoverInForms = function ($scope) {
		$ionicPopover.fromTemplateUrl('templates/ellipsePopoverInForms.html', {
			scope : $scope
		}).then(function (popover) {
			$scope.elipsePopoverInForms = popover;
			openellipsePopoverInForms($scope);
		});

	};
	/**
     * @desc 
        closing elipses in form
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.closeellipsePopoverInForms = function ($scope) {
		closeellipsePopoverInForms($scope);
	};


	/**
     * @desc 
        event for opening elipses in form
     * @author Santhosh Kumar Gunti
 	*/
	function openellipsePopoverInForms($scope){
		$scope.elipsePopoverInForms.show();
	}
	/**
     * @desc 
        event for closing elipses in form
     * @author Santhosh Kumar Gunti
 	*/
	function closeellipsePopoverInForms($scope){
		$scope.elipsePopoverInForms.hide();
	}
	/**
     * @desc 
        event for opening to show existing sketching modal
     * @author Santhosh Kumar Gunti
 	*/

	function openModalOfSketchings($scope){
		$scope.modalForSketchings.show();
	}

	/**
     * @desc 
        event for closing to show existing sketching modal
     * @author Santhosh Kumar Gunti
 	*/
	function closeModalOfSketchings($scope){
		$scope.modalForSketchings.hide();
	}

	/**
     * @desc 
        event for opening to show references modal
     * @author Santhosh Kumar Gunti
 	*/
	function openModalOfReferences($scope){
		$scope.modalForReferences.show();
	}

	/**
     * @desc 
        event for closing to show references modal
     * @author Santhosh Kumar Gunti
 	*/
	function closeModalOfReferences($scope){
		$scope.modalForReferences.hide();
	}

	/**
     * @desc 
        event for closing to route between points modal
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.closeRouteBetweenModal = function($scope){
			$scope.modalRouteBetween2Points.hide();
	}
	/**
     * @desc 
        storing the source and destination of route between 2 point functionality on map by selecting points on map
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.routeSearchDone = function($scope){
		$scope.source = "";
		$scope.destination = "";
    	$scope.measureToolCheck.value = false; 
    	$scope.routeBetween2PointsCheck.value = false; 
    	$scope.bufferSearchCheck.value = false;
    	$scope.bookmarkCheck.value = false;
    	$scope.homeViewCheck.value = false;
    	clearMeasureTool($scope);
    	clearRouteBetween2PointsTool($scope);
    	clearBufferSearchTool($scope);
    	clearHomeViewTool($scope);
		if($rootScope.map.hasLayer($scope.destinationForRouteBetween2Points))
			$rootScope.map.removeLayer($scope.destinationForRouteBetween2Points); // remove

		if($rootScope.map.hasLayer($scope.sourceForRouteBetween2Points))
			$rootScope.map.removeLayer($scope.sourceForRouteBetween2Points); // remove

    	$scope.sourceForRouteBetween2Points = undefined;
    	$scope.destinationForRouteBetween2Points = undefined;
	}
	/**
     * @desc 
       	Fired with method, when click on map 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.onMapClick = function(e,$scope)
    {

				var markerIcon = L.icon({
		            iconUrl: 'images/Box-01.png',
		            //iconUrl: 'images/point-edit.png',
		            iconSize: [10, 10],
		        });

				if($scope.areaGeometryCheck.value == true || $scope.lineGeometryCheck.value == true || $scope.pointGeometryCheck.value == true){

				}
				else if($scope.bufferSearchCheck.value){

			    	var greenIcon = L.icon({
					    iconUrl: 'img/blue.png',
//					    shadowUrl: 'leaf-shadow.png',
					    iconSize:     [30, 30], // size of the icon
//					    shadowSize:   [50, 64], // size of the shadow
//					    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//					    shadowAnchor: [4, 62],  // the same for the shadow
//					    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
					});

			    	removeBufferDistanceCircle($scope);
			    	removeBufferDistanceCnterMarker($scope);
					$scope.bufferDistanceCenterMarker = new L.marker([e.latlng.lat, e.latlng.lng], {icon: greenIcon}).addTo($rootScope.map);

					$rootScope.map.addLayer($scope.bufferDistanceCenterMarker);
					$scope.bufferSearchCenterLat = e.latlng.lat; 
					$scope.bufferSearchCenterLng = e.latlng.lng;
					showPopupForBufferSelection($scope);
			    

			    }
			    else if($scope.routeBetween2PointsCheck.value){
			    	var greenIcon = L.icon({
					    iconUrl: 'img/blue.png',
//					    shadowUrl: 'leaf-shadow.png',
					    iconSize:     [30, 30], // size of the icon
//					    shadowSize:   [50, 64], // size of the shadow
//					    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//					    shadowAnchor: [4, 62],  // the same for the shadow
//					    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
					});


					if($scope.sourceForRouteBetween2Points && $scope.destinationForRouteBetween2Points == undefined){
						$scope.destinationForRouteBetween2Points = new L.marker([e.latlng.lat, e.latlng.lng], {icon: greenIcon}).addTo($rootScope.map);
						$scope.destination = $scope.destinationForRouteBetween2Points._latlng.lat + ',' + $scope.destinationForRouteBetween2Points._latlng.lng;

					}else if($scope.sourceForRouteBetween2Points == undefined){
						$scope.sourceForRouteBetween2Points = new L.marker([e.latlng.lat, e.latlng.lng], {icon: greenIcon}).addTo($rootScope.map);
						$scope.source = $scope.sourceForRouteBetween2Points._latlng.lat + ',' + $scope.sourceForRouteBetween2Points._latlng.lng;
					}
			    }
			    else if($scope.measureToolCheck.value){
		            $scope.coord.push(e.latlng);

		            var area = L.GeometryUtil.geodesicArea($scope.coord);

		            var res = $scope.coord;
		            $scope.totalDistance = distance(res);
		            var newMarker = new L.marker(e.latlng, {
		                icon: markerIcon
		            }).addTo($rootScope.map);
		            $scope.lthMarkers.push(newMarker);
		            var polyline = L.polyline($scope.coord, {
		                color: '#307FE2'
		            }).addTo($rootScope.map);
		            $scope.polylines.push(polyline);
		            $scope.customControl._container.innerHTML  = '<div style="background-color:#307FE2;padding:10px;"><div style="display:flex">'+
					    '<div style="width: 120px;">Length (Meters)</div>'+
					    '<div>Area (sq.m)</div>'+
					'</div><div ng-click="test()" style="display:flex">'+
					    '<div style="width: 120px;">'+$scope.totalDistance.toFixed(3)+'</div>'+
					    '<div>'+area.toFixed(3)+'</div>'+
					'</div></div>';
				}
			    else{
					if($scope.layerCodes.length > 0){
						commonService.LoaderShow(strings.pleasewait);
			            var url = $scope.baseUrl+"mcs_select?lat=" + e.latlng.lat + "&lon=" + e.latlng.lng + "&zoom=" + $rootScope.map.getZoom() + "&layers="+$scope.layerCodes+"&pixel_tolerance=8";
			            $http.get(url).then(function(response) {
			            	clearMap($scope);
					        setFeature(response.data.features,$scope);
					        showPopup(response.data.features,$scope);
							commonService.Loaderhide();			        
			            },function(){
							commonService.Loaderhide();			        
			            });
			        }
			        else{
						clearMap($scope);
			        }
			    }

    }

    function distance(res) {
        var distances = [];
        var totalDistance = 0;
        if (res.length > 1) {
            for (var i = 0; i < res.length - 1; i++) {
                distances[i] = distHaversine(res[i], res[i + 1]);
                totalDistance += distances[i];
            }
        }
        return totalDistance;
    }
    function distHaversine(p1, p2) {
        var R = 6378137.0,
            C = 1;
        var dLat = rad(p2.lat - p1.lat);
        var dLong = rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c * C;
        return d;
    }
    function rad(x) {
        return x * Math.PI / 180;
    }

    /**
     * @desc 
        event fot Clearing map
     * @author Santhosh Kumar Gunti
 	*/

    mapInServices.clearMap = function($scope){
    	clearMap($scope);
    }
    /**
     * @desc 
        Clearing map
     * @author Santhosh Kumar Gunti
 	*/
    function clearMap($scope){
		if($scope.vectorLayer != null)
               $scope.vectorLayer.clearLayers();
    }
    /**
     * @desc 
        Showing feature details on tap of map 
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.showFeaturedetails = function(id,object_type,showBackButton,$scope){
		showFeaturedetails(id,object_type,showBackButton,$scope);
	}
    /**
     * @desc 
        Modal to show bookmarks
     * @author Santhosh Kumar Gunti
 	*/

    function show($scope){
		if($scope.modalCloseShowBookmark != undefined && $scope.modalCloseShowBookmark._isShown){
		}else{

			$ionicPopover.fromTemplateUrl('templates/showBookmarks.html', {
				scope: $scope,
				"backdropClickToClose" :false
			}).then(function (modal) {
				$scope.modalCloseShowBookmark = modal;
				$scope.modalCloseShowBookmark.show();
			});
		}
	}
	/**
     * @desc 
        Buffer search functionality 
     * @author Santhosh Kumar Gunti
 	*/
	function bufferSearch($scope,lat,lng,bufferSearchDistance){
    	commonService.LoaderShow();
    	drawCircleWithGivenLatlongAndRadius($scope,lat,lng,bufferSearchDistance);
        var url = $scope.baseUrl+"mcs_select_info?lat="+lat+"&lon="+lng+"&pixel_tolerance="+bufferSearchDistance;
        $http.get(url).then(function(response) {
        	commonService.Loaderhide();
        	if(response.data.features.length == 0){
        		alertService.showToast("No features in selected buffer distance");
        	}else{
		        setFeature(response.data.features,$scope);
		        showPopup(response.data.features,$scope);
	    	}
//			highlightingFeatures(response.data,$scope);
        },function(){
        	commonService.Loaderhide();
        });
	}
	/**
     * @desc 
        Creating circle for buffer search 
     * @author Santhosh Kumar Gunti
 	*/
	function drawCircleWithGivenLatlongAndRadius($scope,lat,lng,radius){
		$scope.bufferDistanceCircle = L.circle([lat,lng], radius).addTo($rootScope.map);				
	}

	mapInServices.setFeature = function(data,$scope){
		setFeature(data,$scope);
	}

	/**
     * @desc 
        Set feature on tapping of map 
     * @author Santhosh Kumar Gunti
 	*/
	function setFeature(data,$scope){
            var changed = (data != $scope.previousData);
            if (($scope.currentFeature && changed )||($scope.previousData)){
                $scope.previousData = data;
                $scope.vectorLayer.clearLayers();
                $scope.vectorLayer.addData(data);
            }
            else
            {
                $scope.previousData = data;
                $scope.currentFeature = true;
				highlightingFeatures(data,$scope);
            } 

	}

	/**
     * @desc 
        showing features data on popup when click on map 
     * @author Santhosh Kumar Gunti
 	*/
	function showPopup(data,$scope){
		$scope.featuresCount = data.length;
		if($scope.featuresCount > 1){
			$scope.itemsList = data;
			$rootScope.mapSelectionData = data;
			showModal($scope);
		}else if($scope.featuresCount == 1){
			showFeaturedetails(data[0].id, data[0].properties.myw_object_type,false,$scope);
			showModal($scope);
		}
	}

	/**
     * @desc 
        Showing popup for asking buffer search distance
     * @author Santhosh Kumar Gunti
 	*/

	function showPopupForBufferSelection($scope) {
/*		var promptPopup = $ionicPopup.prompt({
        	title: 'Buffer Length',
         	inputType: 'text',
         	inputPlaceholder: 'Enter Length in meters'
      	});
        
	    promptPopup.then(function(bufferDistance) {
	    	console.log(lat,lng,bufferDistance);
	    	if(bufferDistance != NaN && bufferDistance != undefined){
		        $scope.bufferSearch(lat, lng, bufferDistance);
			}
			else{
				removeBufferDistanceCircle($scope);
				removeBufferDistanceCnterMarker($scope);
			}
	    });
*/
		$ionicPopover.fromTemplateUrl('templates/bufferSelectionModal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalCloseBufferSelection = modal;
			openBufferSearchLengthModal($scope);
		});

    }

	/**
     * @desc 
        showing individual feature data on popup 
     * @author Santhosh Kumar Gunti
 	*/
	function showFeaturedetails(id,object_type,showBackButton,$scope) {
        var url = "https://myworld.tatapower.com/myworld/mcs_feature_info?tablename=" + object_type + "&id=" + id;
        $http.get(url).then(function(response) {
			$scope.featuresCount = 1;
			$scope.itemsList = response.data;
			$scope.backButton = showBackButton;
			$scope.dataToCopyInMapInteractionField = response.data;
			zoomToCurrentBBox(response.data.bbox,$scope);
        },function(){
			commonService.Loaderhide();			        
        });
	}

	mapInServices.zoomToCurrentBBox = function(bbox,$scope){
		zoomToCurrentBBox(bbox,$scope);
	}

	mapInServices.openBufferSearchLengthModal = function($scope){
		openBufferSearchLengthModal();
	}

	mapInServices.closeBufferSearchLengthModal = function($scope){
		closeBufferSearchLengthModal($scope);
	}

	function openBufferSearchLengthModal($scope){
		$scope.modalCloseBufferSelection.show();
	}

	function closeBufferSearchLengthModal($scope){
		$scope.modalCloseBufferSelection.hide();
	}

	mapInServices.okBufferLength =  function($scope,bufferDistance,lat,lng){
		if(bufferDistance != NaN && bufferDistance != undefined){
				closeBufferSearchLengthModal($scope);
		        bufferSearch($scope,lat,lng,bufferDistance);
		}
		else{
			removeBufferDistanceCircle($scope);
			removeBufferDistanceCnterMarker($scope);
		}		
	}
	/**
     * @desc 
        zooming to the selected feature 
     * @author Santhosh Kumar Gunti
 	*/
	function zoomToCurrentBBox(bbox,$scope){
/*        var southWest = L.latLng(bbox[1],bbox[0]),
        northEast = L.latLng(bbox[3] - 0.002,bbox[2]),
        bounds = L.latLngBounds(southWest, northEast);
        var zoom= $rootScope.map.getZoom()<15?17:21
        $rootScope.map.fitBounds(bounds,{"maxZoom":zoom});
*/
        $rootScope.map.fitBounds([
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]]
        ]);
	}

	/**
     * @desc 
        opening modal
     * @author Santhosh Kumar Gunti
 	*/
	function showModal($scope){
		if($scope.modalFeatureSelection != undefined && $scope.modalFeatureSelection._isShown){
//			$scope.modalFeatureSelection.hide();
		}else{
			$ionicModal.fromTemplateUrl('templates/modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.modalFeatureSelection = modal;
				$scope.modalFeatureSelection.show();
			});
		}
	}

	/**
     * @desc 
        highlighting feature on map
     * @author Santhosh Kumar Gunti
 	*/
	mapInServices.highlightingFeatures = function(data,$scope){
		highlightingFeatures(data,$scope);
	}

	/**
     * @desc 
        highlighting feature on map
     * @author Santhosh Kumar Gunti
 	*/
	function highlightingFeatures(data,$scope){
		var geojsonPointStyle = {
            radius: 20,
            fillColor: "#5DADE2",
            color: "#21618C",
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.4
        };
        $scope.vectorLayer = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
	            return L.circleMarker(latlng, geojsonPointStyle);
	        },
	        onEachFeature: onEachFeature
        });
        $scope.vectorLayer.addTo($rootScope.map);
	}

    function onEachFeature(feature,layer){
        layer.on({
            click : onFeatureClick
        });
    }
    function onFeatureClick(e){
        onMapClick(e);
    }

    return mapInServices;


}])

/*
@developer :Santhosh Kumar Gunti
TPCL customization
changed transition from tabs to sidemenu
*/
app.service('deviceManagement',['loginService','commonService','$state','alertService','$localstorage','config','$ionicHistory',function(loginService,commonService,$state,alertService,$localstorage,config,$ionicHistory){
	var deviceManagementControl ={};

	deviceManagementControl.logout = function(username,manufacturer,model,platform,uuid)
    {
    	if(commonService.checkConnection()){
			var url = config.url + "/logout";
			var data ={};
			data.username = username;
			data.manufacturer = manufacturer;
			data.model = model;
			data.platform = platform;
			data.uuid = uuid;

	    	loginService.logout(url,data,securityHeaders,function(response){
	    		if(response == null){
					alertService.showToast("server down, please contact administrator");			
	    		}
	    		else if(response.status == 200){
					$ionicHistory.clearCache();
					$ionicHistory.clearHistory();
					$state.transitionTo("app.login");
				}else if(response.status == 204){
					alertService.showToast(response.message);				
				}
	    	});
	    }
	    else{
	    	alertService.showToast("You are in offline, can not logout");
	    }
    }
	deviceManagementControl.checkDeviceExists = function($scope,user)
    {
		loginService.getMacAddress(function(MacAddress){
			var deviceData = $localstorage.getObject("deviceInfo");
			var data = {};
			data.Manufacturer = deviceData.manufacturer;
			data.Model = deviceData.model;
			data.platform = deviceData.platform;
			data.UUID = deviceData.uuid;
			data.version = deviceData.version;

			var url = config.url + "/api/v1/devicemanagement/CheckISExists/"+MacAddress+"/"+deviceData.uuid;
			loginService.checkIsAvailable(url,data,securityHeaders, function (response) {
			   	if (response.status == 200) {
		   		 	// IF status returns "Approved" only Allow user to Login
		   		 	if (response.data[0].status == "Approved") {
						commonService.Loaderhide();
						$state.transitionTo("sidemenu.tabs.assignedtasks");
						//$scope.login(user);
		   		 	}
		   		 	else{
						commonService.Loaderhide();
		   		 		alertService.doAlert("Your device is not yet Approved,please contact your administrator!");
		   		 	}
		   		}
		   		// If IMEI is new register new Device with the device info
		   		else{
		   			addDeviceInfo($scope);
		   			// alertService.doAlert(response.message);
		   		}
	   		});
		});
	}


	function addDeviceInfo($scope){
		loginService.getMacAddress(function(MacAddress){
			var url = config.url+"/api/v1/devicemanagement/addMobileDevice";
			var deviceData = $localstorage.getObject("deviceInfo");
			var data = {};
			data.Manufacturer = deviceData.manufacturer;
			data.Model = deviceData.model;
			data.platform = deviceData.platform;
			data.UUID = deviceData.uuid;
			data.version = deviceData.version;
			data.MacAddress = MacAddress;
			data.userName = $scope.username;

			loginService.addNewDevice(url, data, securityHeaders, function (response) {
				if (response.status == 200) {
					commonService.Loaderhide();
					alertService.doAlert(response.message);
				} else {
					commonService.Loaderhide();
					alertService.doAlert(response.message);
				}
			});
		});
	}
	return deviceManagementControl;
}])

/* Tasks download and sync code start by Roja*/
app.service('taskDownloadAndSync',['commonService','$state','alertService','$localstorage','config','reassign','$cordovaSQLite','formsService','promisingMethods','$q','$rootScope','strings',function(commonService,$state,alertService,$localstorage,config,reassign,$cordovaSQLite,formsService,promisingMethods,$q,$rootScope,strings){
	

	var userId = $localstorage.getObject("userId");
	var taskOfflineFunctions={}
		var user ;
	taskOfflineFunctions.downloadTasksForms=function($scope,item,downloadType,deviceDetails){
		user =$localstorage.getObject("username");

		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS formszOfTasks(Username text,FormId integer,FormName text, TaskId integer,Category text,description text,Version text)").then(function (res) {});
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS downloadedTasks (Username text,TaskName text ,TaskId text,Description text,startDate text,endDate text)").then(function (res) {});
		$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text,requiredFields text,derivedFields text)').then(function (res) {}, function (err) {
		alert(JSON.stringify(err));
		});
		$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormData_table(uniqueID integer primary key autoincrement,FormId integer,userId integer ,FormValues text,FormStatus text,TaskId text,recordId text,isRequired text,displayValues text,recordComments text,IsReassign text,lat text,long text,insertDate text,isVideoAvailable text,videoOptions text,videoPath text)').then(function (res) {}, function (err) {
		alert(JSON.stringify(err));
		});
		checkTask(item,downloadType,deviceDetails);
	}
	function checkTask(item,downloadType,deviceDetails){
		var query = "SELECT * FROM downloadedTasks WHERE TaskId=? and Username=?";
		$cordovaSQLite.execute(db, query, [item.taskId,user]).then(function (res) {
			if (res.rows.length == 0) {
	//			console.log("new task")
				var query = 'INSERT INTO downloadedTasks (Username,TaskName,TaskId,Description,startDate,endDate,createdBy) VALUES (?,?,?,?,?,?,?)';
				$cordovaSQLite.execute(db, query, [user, item.TaskName, item.taskId, item.taskDescription, item.startDate, item.endDate,item.createdBy]).then(function (res) {
				//	getFormsOfTask(item);
					if(downloadType=="task"){
		//				console.log(deviceDetails)
						getFormsOfTask(item,deviceDetails,downloadType);
					}else{
						var data={
							formId:item.FormId,
							formName:item.FormName
						}
	//					console.log(deviceDetails)
					//	insertFormsIntoTable(item,data,deviceDetails,downloadType)
					insertFormsIntoTable(item,data,deviceDetails,downloadType,function(insertResponse){
				console.log(insertResponse)
				// console.log(item.FormDetails.length)
				alertService.doAlert(strings.downloadSuccess);
			
			})
					}
				}, function (err) {
				alert(JSON.stringify(err));
				});
				
			} else {
			//	getFormsOfTask(item);
				if(downloadType=="task"){
	//				console.log(downloadType)
					getFormsOfTask(item,deviceDetails,downloadType);
				}else{
					var data={
							formId:item.FormId,
							formName:item.FormName
						}
				//	insertFormsIntoTable(item,data,deviceDetails,downloadType);
			insertFormsIntoTable(item,data,deviceDetails,downloadType,function(insertResponse){
				console.log(insertResponse)
				// console.log(item.FormDetails.length)
				alertService.doAlert(strings.downloadSuccess);
			});
				}
			}

		}, function (err) {
		alert(JSON.stringify(err));
		});
	}
	function getFormsOfTask(item,deviceDetails,downloadType){
//		console.log(item)
//		console.log(downloadType)
		angular.forEach(item.FormDetails, function (formData, key) {
			console.log(formData)
			console.log(key)
			insertFormsIntoTable(item,formData,deviceDetails,downloadType,function(insertResponse){
				console.log(insertResponse)
				console.log(item.FormDetails.length)
				console.log(key)
				key++
				if(key==(item.FormDetails.length)){
					if(downloadType=='task'){
	   		 		//	alertService.doAlert(item.TaskName + " downloaded Successfully");
	   		 			alertService.doAlert(strings.downloadSuccess);
					}else{
	   		 			alertService.doAlert(strings.downloadSuccess);
	   		 		//	alertService.doAlert(item.FormName + " downloaded Successfully");
					}
				}
				
			})
		});
		
	}
	function insertFormsIntoTable(item,formData,deviceDetails,downloadType,callback){
		var query = "SELECT * FROM formszOfTasks WHERE Username=? and TaskId=? and FormId=?";
			$cordovaSQLite.execute(db, query, [user, item.taskId, formData.formId]).then(function (res) {
			if (res.rows.length <= 0) {
//				console.log("form is new")
				var query = "INSERT INTO formszOfTasks (Username, FormId,FormName, TaskId,Category,description,Version ) VALUES (?,?,?,?,?,?,?)";
				$cordovaSQLite.execute(db, query, [user, formData.formId, formData.formName, item.taskId,JSON.stringify(formData.FormCategory),formData.formDescription,formData.version]).then(function (res) {
	//			console.log(deviceDetails)
					
				}, function (err) {
				alert(JSON.stringify(err));
				});
			}else{
				
			}
			checkFormRecords(formData.formId,item,deviceDetails,downloadType,function(recordsStatus){
					if(recordsStatus=="success"){
						console.log("returend status into ")
						callback(true)
					}
				});
			}, function (err) {
				alert(JSON.stringify(err));
		});
	}
	function checkFormRecords(formId, item,deviceDetails,downloadType,callback) {
		var checkFormSkeleton;
		console.log(downloadType)
		var url = config.url + "/api/v1/formszDetails/downloadService";
			deviceDetails.taskId=item.taskId
			deviceDetails.formId=formId
			deviceDetails.user=user
	 reassign.downloadTask(url,deviceDetails, securityHeaders, function (response) {
	 	console.log(response)
		angular.forEach(response, function (data, index) {
			console.log(data)
			if(data.DownloadRecords!=0){
		angular.forEach(data.DownloadRecords, function (dispValues, dispKey) {
			if( dispValues.IsReassign){
				var FormStatus="reassign";
			}else{
				var FormStatus="new";
			}
			var recDpvals = [];
			angular.forEach(dispValues.DisplayValues, function (dpvals, dpkeys) {
				recDpvals.push(dpvals.fieldIdName);
			});
			var query = "SELECT * FROM FormData_table WHERE recordId=?";
			$cordovaSQLite.execute(db, query, [dispValues.recordId]).then(function (res) {
			if(res.rows.length <= 0) {
			var query = 'INSERT INTO FormData_table (FormId,userId, FormValues,FormStatus,TaskId,recordId,isRequired,displayValues,recordComments,IsReassign,lat,long,insertDate,isVideoAvailable) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
			$cordovaSQLite.execute(db, query, [data.formId, userId, JSON.stringify(dispValues.AllFields), FormStatus, item.taskId, dispValues.recordId, false, JSON.stringify(recDpvals),dispValues.comments, dispValues.IsReassign,"","","",data.isMediaAvailable]).then(function (res) {				
			}, function (err) {
				alert(JSON.stringify(err));
			});
			}else{
		//		callback(checkFormSkeleton)
				/*if (dispKey === (response.length - 1)) {
	   		 		if(downloadType=='task'){
	   		 			alertService.doAlert(item.TaskName + " downloaded Successfully");
	   		 		//	$rootScope.$broadcast('refreshtasks');
					}else{
	   		 			alertService.doAlert(item.FormName + " downloaded Successfully");
	   		 		//	$rootScope.$broadcast('refreshForms');
					}
				}*/
		//		checkFormSkeletonOffline(data.formId);
			}
			}, function (err) {
				alert(JSON.stringify(err));
			});
			});
		checkFormSkeletonOffline(data.formId);
		callback("success")
	}else{
	//	console.log("//////////////////////////////////////")
	//	console.log(downloadType)
	/*	if(downloadType=='task'){
	   		alertService.doAlert(item.TaskName + " downloaded Successfully");
	   	//	$rootScope.$broadcast('refreshtasks');
		}else{
	 		alertService.doAlert(item.FormName + " downloaded Successfully");
	 	//	$rootScope.$broadcast('refreshForms');
		}*/
	//	checkFormSkeletonOffline(data.formId);
	checkFormSkeletonOffline(data.formId);
	callback("success")
	}
	/*checkFormSkeletonOffline(data.formId,function(skeletonInsertStatus){
		 checkFormSkeleton=skeletonInsertStatus;

	});*/
	});
	});		
	}
	function checkFormSkeletonOffline(formId) {
		console.log(formId)
		var url = config.url + "/api/v1/formsz/" + formId;
		formsService.navigateToForms(url, securityHeaders, function (status, response) {
			console.log(response)
			var taskFormSkeleton = JSON.stringify(response.FormSkeleton);
		//	var taskFormId = response._id;
			var taskFormName = response.name;
			$cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS FormSkeleton_table(FormId integer,Username text,id integer, FormName text ,FormSkeleton text,requiredFields text,derivedFields text)').then(function (res) {}, function (err) {});
			var query = "SELECT * FROM FormSkeleton_table WHERE FormId=?";
			$cordovaSQLite.execute(db, query, [formId]).then(function (res) {
				console.log(res.rows.length)
				if (res.rows.length == 0) {
					var query = 'INSERT INTO FormSkeleton_table (FormId,Username, id, FormName, FormSkeleton,requiredFields,derivedFields) VALUES (?,?,?,?,?,?,?)';
					$cordovaSQLite.execute(db, query, [formId, user, userId, response.name,  JSON.stringify(response.FormSkeleton), JSON.stringify(response.requiredField), JSON.stringify(response.dependentFields)]).then(function (res) {
				//	alert("Task Downloaded")
			//	callback(true)
				console.log(res)
					console.log(res)
					}, function (err) {
						alert(JSON.stringify(err));

					});
				} else {
				}
			}, function (err) {
			//	callback(false)
				alert("shssssss" + JSON.stringify(err));
			});
		});
	}
	taskOfflineFunctions.getLocalDbSkeleton=function(formId,$scope) {
		var query = 'SELECT * FROM FormSkeleton_table WHERE FormId=? ';
		$cordovaSQLite.execute(db, query, [formId]).then(function (res) {
			var len = res.rows.length;
			commonService.Loaderhide();
			for (var i = 0; i <= len; i++) {
				var formSkeleton = JSON.parse(res.rows.item(0).FormSkeleton);
				var derivedFields = res.rows.item(0).derivedFields;
				$localstorage.setObject("offlineData", formSkeleton);
				$scope.fields = formSkeleton;
			}
		}, function (err) {
			alert(JSON.stringify(err));
		});
	}
	taskOfflineFunctions.syncTasksOnline=function(selection,$scope,downloadType){
	//	syncOnlineConfirmation(selection);
		syncOfflineTasks(selection,$scope,downloadType);
	}
	taskOfflineFunctions.syncTaskFormsOnline=function(selection,taskId ,$scope,downloadType){
		syncOfflineForm(selection,taskId,$scope,downloadType);
	//	syncOnlineConfirmation(selection);
	}

function syncOfflineTasks  (item,$scope,downloadType) {
		console.log(item);
			var count=0;
		var finalArray=[];
		updateArray = [];
		insertArray = [];
		var data = {};
		for (var i = 0; i < item.length; i++) {
			formdataloopTasks(item[i], function (updateResponse, insertResponse,taskId) {
				var url = config.url+"/api/v1/formszDetails/syncMultipleRecordsForMultipleTasksDownloaded";
	//			var url = config.url+"/api/v1/formszDetails/syncMultipleRecordsForMultipleTasks";
               count++;
                data.updateArray = updateResponse;
				data.insertArray = insertResponse;
			console.log(data)

				if (count == item.length) {
					formsService.syncAddresses(url, data, securityHeaders, function (serverResponse) {
						console.log(serverResponse);

                        deleteOfflineJobSAndForms(serverResponse.offlineTaskIdArray,serverResponse.offlineFormIdArray,$scope,downloadType);
						deleteEditedAddress(serverResponse.updatedPreppopList, serverResponse.insertedArray,$scope,downloadType);
	                //    getAssignedTasks();
					});
				}
			});
		}

	}	
 function syncOfflineForm  (item,taskId,$scope,downloadType) {
		updateArray = [];
		insertArray = [];
		var count=0;
		var data = {};
		var url = config.url + '/api/v1/formszDetails/syncmultipleFormRecords';
		for (var i = 0; i < item.length; i++) {
			formdataloopForms(item[i],taskId, function (updateResponse, insertResponse,formId) {
                data.updateArray = updateResponse;
				data.insertArray = insertResponse;
				count++;
				console.log(data)
			if (count == item.length) {
				console.log("cuccess")
				formsService.syncAddresses(url, data, securityHeaders, function (serverResponse) {
					console.log(serverResponse);
					var offlineJobIdArray=[];
					deleteOfflineJobSAndForms(serverResponse.updatedtaskIdList,serverResponse.updatedFormIdList,$scope,downloadType);
					deleteEditedAddress(serverResponse.updatedPreppopList, serverResponse.insertArrayList,$scope,downloadType);				
				});
			}
			});	
		}

	}
	function formdataloopTasks (taskId, callback) {
		var query = "SELECT * FROM FormData_table WHERE TaskId=? and FormStatus='saved'";
		$cordovaSQLite.execute(db, query, [taskId]).then(function (res) {
		//	var url = config.url + "/api/v1/formszDetails/create";
			for (var i = 0; i < res.rows.length; i++) {
				var obj = {};
				var isValid = res.rows.item(i).isRequired;
				var uid = res.rows.item(i).uniqueID;
				var FormId = res.rows.item(i).FormId;
				var taskId = res.rows.item(i).TaskId;
				var recordId = res.rows.item(i).recordId;
				var formvalues = res.rows.item(i).FormValues;
				var isVideoAvailable=res.rows.item(i).isVideoAvailable;
				var videoOptions = res.rows.item(i).videoOptions;
				var videoPath = res.rows.item(i).videoPath;
				console.log(isVideoAvailable);
				obj.taskId = taskId;
				obj.formId = FormId;
				obj.lat=res.rows.item(i).lat;
				obj.long=res.rows.item(i).long;
				obj.record = JSON.parse(formvalues).record;
				obj.updatedBy = $localstorage.getObject("username");
				var datenow = new Date();
				var isoDate = datenow.toISOString();
				obj.updatedTime = isoDate;
				obj.generatedId=Date.now();
				console.log(videoOptions)
				if (recordId == "") {
					obj.sqliteDBId = uid;
					insertArray.push(obj);
					if (isVideoAvailable) {
						if (videoOptions == null || videoOptions == '') {
				//			insertArray.push(obj);
						}else{
							syncOfflineVideos(obj,videoPath,videoOptions);
						}
					}else{
				//		insertArray.push(obj);
					}
				
				} // end of if loop
				else {
					obj.IsReassign = false;
					obj._id = recordId;
					obj.updatedTime = res.rows.item(i).insertDate;
					updateArray.push(obj);
					if (isVideoAvailable) {
						if ( videoOptions == null) {
				//			updateArray.push(obj);
						}else{
							syncOfflineVideos(obj,videoPath,videoOptions);
						}
					}else{
				//		updateArray.push(obj,videoPath,videoOptions);
					}

				}
			}
			callback(updateArray, insertArray,taskId);
		}, function (err) {
			//console.log(err)
			console.log(JSON.stringify(err));
		});
	// });
	}
	//-->UE Implementation
		function formdataloopForms (formId,taskId, callback) {
			console.log(formId)
		var query = "SELECT * FROM FormData_table WHERE FormId=? and TaskId=? and FormStatus='saved'";
		$cordovaSQLite.execute(db, query, [formId,taskId]).then(function (res) {
	//		var url = config.url + "/api/v1/formszDetails/create";
			for (var i = 0; i < res.rows.length; i++) {
				var obj = {};
				var isValid = res.rows.item(i).isRequired;
				var uid = res.rows.item(i).uniqueID;
				var FormId = res.rows.item(i).FormId;
				var taskId = res.rows.item(i).TaskId;
				var recordId = res.rows.item(i).recordId;
				var formvalues = res.rows.item(i).FormValues;
				var isVideoAvailable=res.rows.item(i).isVideoAvailable;
				var videoOptions = res.rows.item(i).videoOptions;
				var videoPath = res.rows.item(i).videoPath;
				console.log(isVideoAvailable);
				obj.taskId = taskId;
				obj.formId = FormId;
				obj.lat=res.rows.item(i).lat;
				obj.long=res.rows.item(i).long;
				obj.record = JSON.parse(formvalues).record;
				obj.updatedBy = $localstorage.getObject("username");
				obj.generatedId=Date.now();
				var datenow = new Date();
				var isoDate = datenow.toISOString();
				obj.updatedTime = isoDate;
				console.log(videoOptions)
				console.log(videoPath)
			//	obj.markerStyleCode=res.rows.item(i).markerColorCode;
				console.log(recordId)
				if (recordId == "") {
					obj.sqliteDBId = uid;
					insertArray.push(obj);
					if (isVideoAvailable) {
						if (videoOptions == null) {
						//	insertArray.push(obj);
						}else{
							console.log("..............................")
							syncOfflineVideos(obj,videoPath,videoOptions);
					//	videosArray.push(obj,videoPath,videoOptions)
						}
					}else{
					//	insertArray.push(obj);
					}
				} // end of if loop
				else {
					obj.IsReassign = false;
					obj._id = recordId;
					obj.updatedTime = res.rows.item(i).insertDate;
					updateArray.push(obj);
					if (isVideoAvailable) {
						if (videoOptions == null) {
					//		updateArray.push(obj);
						}else{
							syncOfflineVideos(obj,videoPath,videoOptions);
						}
					}else{
				//		updateArray.push(obj);
					}
				}
			}
			callback(updateArray, insertArray,FormId);
		}, function (err) {
			//console.log(err)
			console.log(JSON.stringify(err));
		});
	// });
	}
	//Addition:Roja:Added to Delete all synced Jobs 
	function deleteOfflineJob(offlineJobIdArray,$scope){
      var convertArray = '("' + offlineJobIdArray + '")';
            var arr = convertArray.replace(/,/g, '","');
                var query = "DELETE FROM downloadedTasks WHERE TaskId IN " + arr
                $cordovaSQLite.execute(db, query).then(function (res) {
                	$rootScope.$broadcast('clearselection');
                }, function (err) {
                	//console.log(err)
                    console.log(JSON.stringify(err));
                });
	}
	function deleteOfflineJobSAndForms(offlineJobIdArray,formIds,$scope,downloadType){
		console.log(offlineJobIdArray)
		if (offlineJobIdArray.length != 0) {
      var convertArray = '("' + offlineJobIdArray + '")';
            var arr = convertArray.replace(/,/g, '","');
                var query = "DELETE FROM downloadedTasks WHERE TaskId IN " + arr
                $cordovaSQLite.execute(db, query).then(function (res) {
                if(downloadType=='tasks'){
				$rootScope.$broadcast('refreshtasks');

					}else{
				$rootScope.$broadcast('clearselection');
					}
                }, function (err) {
                    console.log(JSON.stringify(err))
                    //alert(JSON.stringify(err));
                });
        }if(formIds.length!=0){

        	var convertArray = '("' + formIds + '")';
            var arr = convertArray.replace(/,/g, '","');
                var query = "DELETE FROM formszOfTasks WHERE FormId IN " + arr
                $cordovaSQLite.execute(db, query).then(function (res) {
   					if(downloadType=='tasks'){
				$rootScope.$broadcast('refreshtasks');

					}else{
				$rootScope.$broadcast('clearselection');
					}
                }, function (err) {
                    console.log(JSON.stringify(err));
                });
        }
	}
	
	//<--
	//-->UE Implementation
	//Addition:Roja:Added to Delete all synced addresses 
	function deleteEditedAddress  (updatedRecIds, insertRecIds,$scope,downloadType) {
		if (updatedRecIds.length != 0) {
			var convertArray = "('" + updatedRecIds + "')";
			var arr = convertArray.replace(/,/g, "','")
				var query = "DELETE FROM FormData_table WHERE recordId IN " + arr
				$cordovaSQLite.execute(db, query).then(function (res) {
					if(downloadType=='tasks'){
				$rootScope.$broadcast('refreshtasks');

					}else{
				$rootScope.$broadcast('clearselection');
					}
				}, function (err) {

					console.log(JSON.stringify(err));
				});
		}
		if (insertRecIds!=undefined && insertRecIds.length != 0) {
			var convertToArray = '("' + insertRecIds + '")';
			var idArray = convertToArray.replace(/,/g, '","')
				var query = "DELETE FROM FormData_table WHERE uniqueID IN " + idArray
				$cordovaSQLite.execute(db, query).then(function (res) {
				if(downloadType=='tasks'){
				$rootScope.$broadcast('refreshtasks');

					}else{
				$rootScope.$broadcast('clearselection');
					}
				}, function (err) {
					console.log(JSON.stringify(err));
				});

		} else {
		//	$scope.refreshItems();
		}

	}
	function syncOfflineVideos(obj,videoPath,videoOptions){
		var promises=[];
		console.log(obj);
	//	var url = config.url + "/api/v1/formszDetails/create";				
		var videoUrl = config.url + "/api/v1/gridFS/addvideo/";
		/*promisingMethods.createRecord(url,obj,securityHeaders).then(function(result){
			console.log(result)
			promises.push(result)
		});	*/
		promisingMethods.uploadVideo(videoUrl,videoPath, JSON.parse(videoOptions), obj.generatedId).then(function (result) {
			console.log(result)
			promises.push(result)
			$q.all(promises).then(function(results){
			console.log(results)
			commonService.Loaderhide();
	//		alert("success")
			$rootScope.$broadcast('clearselection');
		});
		});
		
	
	}

		return taskOfflineFunctions;

	//<--
}])
/* Tasks download and sync code End by Roja*/
