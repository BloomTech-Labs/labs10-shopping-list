//
//  NavigationController.swift
//  ShoppingList
//
//  Created by Yvette Zhukovsky on 2/26/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class NavigationController: UINavigationController {
    override func viewDidLoad() {
        super.viewDidLoad()
        self.delegate = self
    }
}

extension NavigationController: UINavigationControllerDelegate {
    func navigationController(_ navigationController: UINavigationController, willShow viewController: UIViewController, animated: Bool) {
        
        SessionManager.retrieveProfile { (profile, error) in
            if let error = error {
                NSLog("settings: retrieveProfile: \(error)")
                return
            }
            
            guard let settingsVC = viewController as? SettingsTableViewController else {
                return
            }
            
            UI {
                settingsVC.userProfile = profile
            }
        }
    }
}
