package bit.project.server.controller;


import bit.project.server.UsecaseList;
import bit.project.server.dao.AttendanceDao;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.dao.PorderDao;
import bit.project.server.dao.ProductDao;
import bit.project.server.entity.Product;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    ProductDao productDao;

    @Autowired
    EmployeeDao employeeDao;

    @Autowired
    PorderDao porderDao;

    @Autowired
    AttendanceDao attendanceDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @GetMapping("/year-wise-employee-count/{yearCount}")
    public ArrayList<HashMap<String, Object>> yearWiseEmployeeCount(@PathVariable Integer yearCount, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to show this report", UsecaseList.SHOW_YEAR_WISE_EMPLOYEE_COUNT);

        ArrayList<HashMap<String, Object>> data = new ArrayList<>();

        ArrayList<LocalDate[]> years = new ArrayList<>();

        LocalDate[] currentYear = new LocalDate[2];
        currentYear[0] = LocalDate.parse(LocalDate.now().getYear() + "-01-01");
        currentYear[1] = LocalDate.parse(LocalDate.now().getYear() + "-12-31");
        years.add(currentYear);

        for (int i = 0; i < yearCount - 1; i++) {
            LocalDate[] year = new LocalDate[2];
            LocalDate[] lastYear = years.get(years.size() - 1);
            year[0] = lastYear[0].minusYears(1);
            year[1] = lastYear[1].minusYears(1);
            years.add(year);
        }

        for (LocalDate[] year : years) {
            String y = String.valueOf(year[0].getYear());
            Long count = employeeDao.getEmployeeCountByRange(year[0], year[1]);
            HashMap<String, Object> d = new HashMap<>();
            d.put("year", y);
            d.put("count", count);
            data.add(d);
        }

        return data;
    }

    @GetMapping("/year-wise-purchase-count/{yearCount}")
    public ArrayList<HashMap<String, Object>> yearWisePurchaseCount(@PathVariable Integer yearCount, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to show this report", UsecaseList.SHOW_YEAR_WISE_PURCHASE_COUNT);

        ArrayList<HashMap<String, Object>> data = new ArrayList<>();

        ArrayList<LocalDate[]> years = new ArrayList<>();

        LocalDate[] currentYear = new LocalDate[2];
        currentYear[0] = LocalDate.parse(LocalDate.now().getYear() + "-01-01");
        currentYear[1] = LocalDate.parse(LocalDate.now().getYear() + "-12-31");
        years.add(currentYear);

        for (int i = 0; i < yearCount - 1; i++) {
            LocalDate[] year = new LocalDate[2];
            LocalDate[] lastYear = years.get(years.size() - 1);
            year[0] = lastYear[0].minusYears(1);
            year[1] = lastYear[1].minusYears(1);
            years.add(year);
        }

        for (LocalDate[] year : years) {
            String y = String.valueOf(year[0].getYear());
            Long count = porderDao.getPurchaseCountByRange(year[0], year[1]);
            HashMap<String, Object> d = new HashMap<>();
            d.put("year", y);
            d.put("count", count);
            data.add(d);
        }

        return data;
    }




    @GetMapping("/month-wise-employee-count/{yearCount}")
    public ArrayList<HashMap<String, Object>> monthWiseEmployeeCount(@PathVariable Integer monthCount, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to show this report", UsecaseList.SHOW_MONTH_WISE_EMPLOYEE_COUNT);

        ArrayList<HashMap<String, Object>> data = new ArrayList<>();

        ArrayList<LocalDate[]> months = new ArrayList<>();

        LocalDate[] currentMonth = new LocalDate[2];
        currentMonth[0] = LocalDate.parse(LocalDate.now().getMonth()+"-01-01");
        currentMonth[1] = LocalDate.parse(LocalDate.now().getMonth()+"-12-31");
        months.add(currentMonth);

        for (int i=0; i<monthCount-1; i++){
            LocalDate[] month = new LocalDate[2];
            LocalDate[] lastMonth = months.get(months.size()-1);
            month[0] = lastMonth[0].minusMonths(1);
            month[1] = lastMonth[1].minusMonths(1);
            months.add(month);
        }

        for (LocalDate[] month : months){
            String y = String.valueOf(month[0].getMonth());
            Long count = attendanceDao.getEmployeeCountByRange(month[0], month[1]);
            HashMap<String, Object> d = new HashMap<>();
            d.put("day", y);
            d.put("count", count);
            data.add(d);
        }

        return data;
    }


/*    @GetMapping("/product-inventory/{yearCount}")
    public List<Product> monthWiseEmployeeCount(HttpServletRequest request){
        this.productDao.findAllBasic()
    }*/

}
