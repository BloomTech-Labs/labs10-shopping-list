//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit

class MainViewController: UIViewController, StoryboardInstantiatable {

    static let storyboardName: StoryboardName = "MainViewController"
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    // MARK: - IBActions
    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
    }
    

}

