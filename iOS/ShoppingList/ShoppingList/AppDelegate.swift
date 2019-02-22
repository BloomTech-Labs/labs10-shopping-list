//
//  AppDelegate.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0
import SwiftKeychainWrapper
import SimpleKeychain

let defaults = UserDefaults.standard

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        window = UIWindow()
        window?.makeKeyAndVisible()
     let accessToken = A0SimpleKeychain(service: "Auth0").string(forKey:"access_token")
      
        
       
        
       // let isLoggedIn = defaults.bool(forKey: Keys.isUserLoggedInKey)
        let loginVC = LoginViewController.instantiate()
        let mainVC = MainViewController.instantiate()
        
        
            window?.rootViewController = (accessToken != nil) ? mainVC : loginVC
     
        return true
    }

    //Auth0 requires this function in AppDelegate
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any]) -> Bool {
        return Auth0.resumeAuth(url, options: options)
    }
    
    
}

