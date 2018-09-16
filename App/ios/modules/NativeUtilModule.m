//
//  NativeUtilModule.m
//  ACAssess
//
//  Created by Ennnnnn7 on 2018/8/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "NativeUtilModule.h"
#import "MBProgressHUD.h"
#import "MBProgressHUD+LJHud.h"

@implementation NativeUtilModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(showToast:(NSString *)message) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [MBProgressHUD showMessage:message delay:1];
    });
    
}

@end
