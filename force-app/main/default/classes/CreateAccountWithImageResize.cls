public with sharing class CreateAccountWithImageResize {
    
    // https://marcoalmodova.medium.com/lwc-and-promises-chaining-9eac0e65e540  reference article 
    
    @AuraEnabled

    //Author : Kavya 
    //Date : 16-01-2023 
    //Aim :- 
    
    // added String nameOfFile as another parameter in the method
    // removed second parameter nameOfFile
    
    public static String integrateAccount(String accountId){
        //String AccountUniqueNumber = accountId;
        
        // String NameOfImageFile = nameOfFile;
        
        //do your API call here.
        Datetime targetDate = System.now().addSeconds(5);
        
        while(System.Now() < targetDate){
            
        }
        //return AccountUniqueNumber;
        return 'ok';      
    }
    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
    }
    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
            insert cv;
            return cv;
        } 
        catch(DMLException e) 
        {
            System.debug(e);
            return null;
        }
    }
    private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } 
        catch(DMLException e) 
        {
            System.debug(e);
            return null;
        }
    }
}