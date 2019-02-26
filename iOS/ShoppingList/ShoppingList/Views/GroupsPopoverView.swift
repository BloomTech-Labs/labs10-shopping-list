//
//  GroupsPopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/26/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class GroupsPopoverView: UIView, NibInstantiatable, UITableViewDelegate, UITableViewDataSource {
    
    static let nibName: NibName = "GroupsPopoverView"
    
    override func awakeFromNib() {
        super.awakeFromNib()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .red
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ReuseIdentifier")
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReuseIdentifier", for: indexPath)
        cell.textLabel?.text = "\(indexPath.row)"
        return cell
    }
    
    @IBOutlet weak var tableView: UITableView!
    
}
