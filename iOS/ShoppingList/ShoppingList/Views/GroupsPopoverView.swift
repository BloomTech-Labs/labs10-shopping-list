//
//  GroupsPopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/26/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

protocol GroupsPopoverViewDelegate: class {
    func selectedGroupChanged()
}

class GroupsPopoverView: UIView, NibInstantiatable, UITableViewDelegate, UITableViewDataSource {
    
    static let nibName: NibName = "GroupsPopoverView"
    weak var delegate: GroupsPopoverViewDelegate?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.rowHeight = 80
        tableView.separatorStyle = .none
        tableView.tableFooterView = UIView()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ReuseIdentifier")
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return allGroups.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReuseIdentifier", for: indexPath)
        cell.textLabel?.text = allGroups[indexPath.row].name
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        selectedGroup = allGroups[indexPath.row]
        delegate?.selectedGroupChanged()
        popover.dismiss()
    }
    
    @IBOutlet weak var tableView: UITableView!
    
}
