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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let newGroup = CoreDataManager.shared.new(Group.self)
        newGroup?.name = "TestName"
        newGroup?.createdAt = Date()
        
        CoreDataManager.shared.save()
        
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            
            print("Total groups: \(CoreDataManager.shared.total(Group.self))")
            
        }
        
    }
    
    
    

    
}

